
                require(["dojox/mobile", "dojo/dom", "dojo/dom-construct","dojo/_base/window", "dojo/dom-attr", "dojo/topic",  "dojo/_base/connect", 
                "dojo/_base/declare", "dojox/mobile/parser", "dojox/mobile/deviceTheme", "dojo/ready", "dijit/registry",
                    "dojox/mobile/compat", "dojox/mobile/View" ,"dojox/mobile/ViewController", "dojox/mobile/ListItem","dojox/mobile/ProgressIndicator","dojox/mobile/SwapView","dojox/mobile/Button",
                    "dojox/mobile/ToolBarButton", "dojox/mobile/FixedSplitter", "dojox/mobile/Container",
                    "dojox/mobile/ScrollableView","dojox/mobile/ScrollablePane","dojox/mobile/Container", "dojox/mobile/TabBar","dojox/mobile/RoundRectCategory", "dojox/mobile/ContentPane" ,
                    ], function(mobile,dom, domConstruct, win, attr,topic,connect,declare, parser, deviceTheme, ready, registry, compat, View,ViewController,  ListItem, ProgressIndicator, SwapView){
                        ready(function(){
							var urlParams = getUrlParams();
                            var currentmygpsId = parseInt(urlParams['id']);

							var view = LoadView(currentmygpsId, domConstruct.create("DIV", null, dojo.byId('mygpslist'), "first"));
							ensureSlibingViewsPreloaded(view);
							setTimeout(function(){registry.byId('mygpsdetail'+currentmygpsId).show();},100)

                         });
						function LoadView(mygpsid, where)
						{

							var newView = new SwapView({
								id:'mygpsdetail'+mygpsid,
								selected:false
													   //});
							}, where);

							attr.set(newView.containerNode, 'mygpsid', mygpsid);
							newView.startup();
							var sp = new dojox.mobile.ScrollablePane(
							{
								id:'sp'+mygpsid
							});
							
							var pane = new dojox.mobile.ContentPane({
																	id:'cp'+mygpsid,
																href:'content/my-gps-detail-test.html'	
																	});
							var headerRT = new dojox.mobile.RoundRectCategory({
																		id:'rtc'+mygpsid,
																		});
							headerRT.containerNode.innerHTML = 'Related Topics';
							var listRT = new dojox.mobile.RoundRectList({
																		id:'rt'+mygpsid,
																		});
							for(var i = 1; i <= 3; i++){
									var content = '<img src="images/my-gps-list-item-icon.png" class="listimage"/><div class="panel"><h2>A Snapshot of GS&amp;Market...</h2><time>December 11, 2012</time></div>';
                                        var item1 = new ListItem({
                                            icon: "images/i-icon-1.png",
											label: content,
											variableHeight: true,
											href:"my-gps-detail.html?id="+i,
                                        });
                                        listRT.addChild(item1);
                                    }
									//listRT.addChild(loadingMore);
							newView.addChild(sp);
							pane.placeAt(sp); 
							headerRT.placeAt(sp); 
							listRT.placeAt(sp); 
							return newView;
						}
						
						topic.subscribe("/dojox/mobile/viewChanged", function (view) { 
							ensureSlibingViewsPreloaded(view);
							
							
						});
						function ensureSlibingViewsPreloaded(view)
						{
							var currentmygpsId = parseInt(attr.get(view.containerNode, 'mygpsid'));
							var leftView = view.getPreviousSibling();
							if (leftView == null && currentmygpsId > 0)
							{							
								var prevmygpsId = currentmygpsId -1;
								LoadView(prevmygpsId, domConstruct.create("DIV", null, view.containerNode, "before"));
							}
							var rightView = view.getNextSibling();
							if (rightView == null && currentmygpsId < 110)
							{							
								var nextmygpsId = currentmygpsId + 1;
								LoadView(nextmygpsId, domConstruct.create("DIV", null, view.containerNode, "after"));
							}
							registry.byId('mygpsdetail'+currentmygpsId).show();
						}

                    });