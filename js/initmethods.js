  // alchemy渲染结束后添加配置的图标，绑定鼠标悬浮事件，自带的悬浮事件中鼠标位置只有画布中的位置，无法获取与画布盒子关联
  function boundjQueryEvents(config){
    // 根据配置中的图标数据添加自定义图标
    if(config.selfImage){
      d3.selectAll('.textpath').classed("edgetext", true);//添加自定义edge文字的样式
      d3.selectAll(".node")
      .insert("image",'circle')
      .attr({
          width: function(d){return d.radius * 2},
          height: function(d){return d.radius * 2},
          x: function(d){return '-'+d.radius+'px'},
          y: function(d){return '-'+d.radius+'px'},
      })
      .attr("xlink:href",function(d){
        var nodetype = String(d.self.getProperties()[selfConf.nodeTypeName]);
        var url = selfConf.nodeConf[nodetype].image;
        return url ? url : this.remove();
      });
      d3.selectAll('image + circle').style('display','none');
    };
    // 显示信息详情窗口，在添加node及edge的方法时共用
    function showDetails(boxid){
      var data = this.getProperties();
      var boxid = boxid || '#peopleDetail',
          dom = '',
          prop = data.properties || {};
      for(var p in prop){
        dom += '<p>'+(textjson[p]||'ID')+'：'+(prop[p]||'无数据')+'</p>';
      }
      if(dom){
        $(boxid).html(dom).show();
      }
      else $(boxid).html('').hide();
    }
    alchemy.clearAllClass = function(){
      alchemy.clearNodesClass();
      alchemy.clearEdgesClass();
    }
    alchemy.clearNodesClass = function(){
      var allNodes = alchemy.get.nodes().all();
      allNodes.forEach(function(item){
        item.clearClass();
      });
    }
    alchemy.clearEdgesClass = function(){
      var allEdges = alchemy.get.edges().all();
      allEdges.forEach(function(item){
        item.clearClass();
      });
    }
    alchemy.showNodes = function(){
      var allNodes = alchemy.get.nodes().all();
      allNodes.forEach(function(item){
        item.unHidden();
      });
      $('#filters #node-dropdown li').removeClass('selected');
    }
    alchemy.showEdges = function(){
      var allEdges = alchemy.get.edges().all();
      allEdges.forEach(function(item){
        item.unHidden();
      });
      $('#filters #rel-dropdown li').removeClass('selected');
    };
    alchemy.showAll = function(){
      alchemy.showNodes();
      alchemy.showEdges();
    };
    //关系线新增方法 start
    alchemy.get.edges().all().forEach(function(edge){
      var d3Edge = d3.select('#edge-'+edge.id+'-'+edge._index);
      var _this = edge;
      _this.bigger = function(){
        d3Edge.classed('bigger',true);
        return edge;
      };
      _this.resize = function(){
        d3Edge.classed('bigger',false);
        return edge;
      };
      
      _this.showDetails = function(boxid){
        showDetails.call(edge,boxid);
        return edge;
      };
      _this.hideDetails = function(){
        $('#peopleDetail').html('').hide();
        return edge;
      };
      _this.highlighted = function(){
        if(edge._state !== "hidden")
          d3Edge.classed("highlight", true);
        return edge;
      };
      _this.unHighlighted = function(){
        if(edge._state !== "hidden")
          d3Edge.classed("highlight", false);
        return edge;
      };
      _this.hidden = function(){
        edge._state = "hidden";
        edge.setStyles();
        d3Edge.classed("hidden", true);
        return edge;
      };
      _this.unHidden = function(){
        edge._state = "active";
        edge.setStyles();
        d3Edge.classed("hidden", false);
        return edge;
      };
      _this.selected = function(){
        if(edge._state!=='hidden'){
          edge._state = "active";
          edge.setStyles();
          d3Edge.classed("selected", true);
        }
        return edge;
      };
      _this.unSelected = function(){
        if(edge._state!=='hidden'){
          edge._state = "active";
          edge.setStyles();
          d3Edge.classed("selected", false);
        }
        return edge;
      };
      _this.clearClass = function(){
        if(edge._state!=='hidden'){
          edge._state = "active";
          edge.setStyles();
          d3Edge.classed('bigger',false).classed('bigger',false).classed('selected',false).classed('highlight',false).classed('related',false);
        }
        return edge;
      };
      _this.toggleHidden = function() {
        edge._state = edge._state === "hidden" ? "active" : "hidden";
        edge.setStyles();
        d3Edge.classed('hidden',edge._state === "hidden");
        return edge;
      };
    });
    //关系线新增方法 end
    //节点新增方法 start
    alchemy.get.nodes().all().forEach(function(node){
      var _this = node;
      var d3Node = d3.select('#node-'+node.id);
      _this.bigger = function(){
        d3Node.classed('bigger',true);
        return node;
      }
      _this.resize = function(){
        d3Node.classed('bigger',false);
        return node;
      }
      _this.showDetails = function(boxid){
        showDetails.call(node,boxid);
        return node;
      };
      _this.hideDetails = function(){
        $('#peopleDetail').html('').hide();
        return node;
      };
      _this.highlighted = function(){
        if(node._state !== "hidden")
          d3Node.classed("highlight", true);
        return node;
      };
      _this.unHighlighted = function(){
        if(node._state !== "hidden")
          d3Node.classed("highlight", false);
        return node;
      };
      _this.selected = function(){
        if(node._state !== "hidden"){
          node._state = "active";
          node.setStyles();
          d3Node.classed("selected", true);
        }
        return node;
      };
      _this.unSelected = function(){
        if(node._state !== "hidden"){
          node._state = "active";
          node.setStyles();
          d3Node.classed("selected", false);
        }
        return node;
      };
      _this.hidden = function(){
        node._state = "hidden";
        node.setStyles();
        d3Node.classed('hidden',true);
        _.each(node._adjacentEdges, function(e) {
          e.hidden();
        });
        return node;
      };
      _this.unHidden = function(){
        node._state = "active";
        node.setStyles();
        d3Node.classed('hidden',false);
        _.each(node._adjacentEdges, function(e) {
          e.unHidden();
        });
        return node;
      };
      _this.clearClass = function(){
        if(node._state !== "hidden"){
          node._state = "active";
          node.setStyles();
          d3Node.classed('bigger',false).classed('selected',false).classed('highlight',false).classed('related',false);
        }
        return node;
      };
      _this.toggleHidden = function() {
        var a;
        a = node.a;
        node._state = node._state === "hidden" ? "active" : "hidden";
        d3Node.classed('hidden',node._state === "hidden");
        node.setStyles();
        _.each(node._adjacentEdges, function(e) {
          var source, sourceState, target, targetState, _ref;
          _ref = e.id.split("-"), source = _ref[0], target = _ref[1];
          sourceState = a._nodes["" + source]._state;
          targetState = a._nodes["" + target]._state;
          if (e._state === "hidden" && (sourceState === "active" && targetState === "active")) {
            e.toggleHidden();
          } else if (e._state === "active" && (sourceState === "hidden" || targetState === "hidden")) {
            e.toggleHidden();
          }
        });
        return node;
      };
      // 显示单个节点的关联节点及线
      _this.showRelatedToPerson = function(){
        if(!node) return;
        if(node.length) node = node[0];
        alchemy.clearAllClass();
        var pid = node.id;
        var nodes = [];
        var edges = [];
        var ids = [];
        function findRelated(node){
          var arg = arguments;
          nodes.push(node);
          ids.push(node.id);
          var cEdges = alchemy.getEdges(node.id);
          cEdges.forEach(function(edge){
            edges.push(edge);
            var edgeData = edge.getProperties();
            var sNode = alchemy.getNodes(edgeData.source)[0];
            var tNode = alchemy.getNodes(edgeData.target)[0];
            if((sNode.getProperties()[selfConf.nodeTypeName] !== 'OrderContact') && (ids.indexOf(edgeData.source)==-1)){
              arg.callee(sNode);
            }else{
              nodes.push(sNode);
            }
            if((tNode.getProperties()[selfConf.nodeTypeName] !== 'OrderContact') && (ids.indexOf(edgeData.target)==-1)){
              arg.callee(tNode);
            }else{
              nodes.push(tNode);
            }
          });
        }
        findRelated(node);
        nodes.forEach(function(node){
          if (node._state !== "hidden") 
            d3.select('#node-'+node.id).classed("related", true);
        });
        edges.forEach(function(edge){
          if (edge._state !== "hidden") 
            d3.select('#edge-'+edge.id+'-'+edge._index).classed("related", true);
        });
        return node;
      };
      //以上为节点方法增加 end
    });
    // 用d3重新绑定的有问题，暂用jquery绑定
    //线条悬浮事件
    $('#alchemy .edge').on('mouseover',function(e){
      var ids = $(this).attr('id').split('-');
      var edge = alchemy.getEdges(ids[1],ids[2])[ids[3]];
      edge.highlighted();
      if(config.edgeMouseOver && typeof config.edgeMouseOver == 'function')
      config.edgeMouseOver(edge);
    }).on('mouseout',function(){
      var ids = $(this).attr('id').split('-');
      var edge = alchemy.getEdges(ids[1],ids[2])[ids[3]];
      edge.unHighlighted();
      if(config.edgeMouseOut && typeof config.edgeMouseOut == 'function')
      config.edgeMouseOut(edge);
    });
    
    //节点悬浮事件
    $('#alchemy .node').on('mouseover',function(e){
      var ids = $(this).attr('id').split('-');
      var node = alchemy.getNodes(ids[1])[0];
      node.highlighted();
      if(config.nodeMouseOver && typeof config.nodeMouseOver == 'function')
      config.nodeMouseOver(node);
    }).on('mouseout',function(){
      var ids = $(this).attr('id').split('-');
      var node = alchemy.getNodes(ids[1])[0];
      node.unHighlighted();
      if(config.nodeMouseOut && typeof config.nodeMouseOut == 'function')
      config.nodeMouseOut(node);
    });
    // 画布自适应大小
    $(window).resize(function(){
      $('#alchemy').css({width:'100%',height:'100%'});
    });
    //使用ajax获取数据时需手动设置svg的alchInst属性，值为Alchemy.prototype.instances.length-1
    if(Alchemy.prototype.instances.length>0)
      d3.select('#alchemy').select('svg').attr("alchInst",Alchemy.prototype.instances.length-1);
    // 动画暂停/开始
    var layoutPause;
    $('#guard .myButton').on('click', function (){
      layoutPause = !layoutPause;
      $(this).text(layoutPause ? '开始动画' : '停止动画');
      return layoutPause ? alchemy.force.stop() : alchemy.force.start();
    });
    //控制面板调整及汉化
    if($('#control-dash-wrapper').length){
      $('#control-dash-wrapper').css('width',600).css('left','100%').find('#dash-toggle').css('margin-left', '-48px').trigger('click');
    $('#control-dash').empty();
    var $filterbox = $( '<div id="filters"></div>');
    var $nodes = $('<div id="filter-nodes">' +
                      '<div id="filter-node-header" data-target="#node-dropdown" data-toggle="collapse"> ' +
                       '<h4>规则</h4> ' +
                       '<span class="fa fa-lg fa-caret-right"></span> ' +
                      '</div> ' +
                      '<ul id="node-dropdown" class="collapse list-group" role="menu">' +
                       '</ul>' +
                   '</div>');
    var riskRules = selfConf.riskRules;
    if(riskRules && riskRules.length){
      $.each(riskRules, function(i,rule){
        $li = $('<li class="list-group-item nodeType" role="menuitem" id="li-Mobile" name="">' + 
                rule.text + ': ' + rule.score + '</li>')
              .on('click', rulesFnCollect[rule.fun]);
        $nodes.children('#node-dropdown').append($li);
      });
    }
    $filterbox.append($nodes).appendTo($('#control-dash'));
    $clearClassBtn = $('<button class="myButton" style="margin-left: 20px;border-radius:5px;">清除样式</button>').on('click',function(){
      alchemy.clearAllClass();
    });
    $showAllBtn = $('<button class="myButton" style="margin-left: 20px;border-radius:5px;">取消隐藏</button>').on('click',function(){
      alchemy.showAll();
    });
    $initialBtn = $('<button class="myButton" style="margin-left: 20px;border-radius:5px;">初始状态</button>').on('click',function(){
      config.initialScale = 1;
      makeLayout(config);
    });
    $('#filter-node-header').on('click',function(){
      var $span = $(this).children('.fa-lg');
      if($span.hasClass('fa-caret-right')){
        $span.removeClass('fa-caret-right').addClass('fa-caret-down');
      }else{
        $span.removeClass('fa-caret-down').addClass('fa-caret-right');
      }
    })
    $('<div style="padding-top: 20px;"></div>').append($clearClassBtn).append($showAllBtn).append($initialBtn)
                      .insertBefore('#filters');
    $('#control-dash-wrapper li').on('click',function(){
      $(this).toggleClass('selected').siblings().removeClass('selected');
    });
    return false;
      $('#filters #filter-header h3').text('过滤');
      $('#filters #filter-node-header h4').text('节点过滤');
      $('#filters #filter-rel-header h4').text('关系过滤');
      $.each($('#filters li'),function(i,item){
        $(item).text(textjson[$(item).text()]);
      });
      $clearClassBtn = $('<button class="myButton" style="margin-left: 20px;border-radius:5px;">清除样式</button>').on('click',function(){
        alchemy.clearAllClass();
      });
      $showAllBtn = $('<button class="myButton" style="margin-left: 20px;border-radius:5px;">取消隐藏</button>').on('click',function(){
        alchemy.showAll();
      });
      $('<div style="padding-top: 20px;"></div>').append($clearClassBtn).append($showAllBtn).insertBefore('#filters');
      $('#control-dash-wrapper li').on('click',function(){
        $(this).toggleClass('selected');
      });
    }
  }
  // 重置布局，即重新请求数据重新渲染
  function makeLayout(config){
    $('#alchemy').html('');
    var changeConfig = $.extend({},config,true);
    changeConfig.nodeMouseOver = undefined;
    changeConfig.nodeMouseOut = undefined;//nodeMouseOut中被返回的是d3元素，要取到self才可以，所以改成一致
    alchemy = new Alchemy(changeConfig);
    boundjQueryEvents(config);// 用jquery改写alchemy中node和edge的的方法
      //alchemy.dash = d3.select("#control-dash-wrapper");
      //alchemy.dash.select('#dash-toggle').on('click', alchemy.interactions.toggleControlDash);
  }
