var lastId = 0;
                require(["dojox/mobile", "dojo/dom", "dojo/dom-construct","dojo/_base/window", "dojo/dom-attr", "dojo/topic",  "dojo/_base/connect", 
                "dojo/_base/declare", "dojox/mobile/parser", "dojox/mobile/deviceTheme", "dojo/ready", "dijit/registry",
                    "dojox/mobile/compat", "dojox/mobile/View" ,"dojox/mobile/ViewController", "dojox/mobile/ListItem","dojox/mobile/ProgressIndicator","dojox/mobile/SwapView","dojox/mobile/Button",
                    "dojox/mobile/ToolBarButton", "dojox/mobile/FixedSplitter", "dojox/mobile/Container",
                    "dojox/mobile/ScrollableView","dojox/mobile/ScrollablePane","dojox/mobile/Container", "dojox/mobile/TabBar","dojox/mobile/RoundRectCategory", "dojox/mobile/ContentPane" ,
                    ], function(mobile,dom, domConstruct, win, attr,topic,connect,declare, parser, deviceTheme, ready, registry, compat, View,ViewController,  ListItem, ProgressIndicator, SwapView){
                        ready(function(){
							var urlParams = getUrlParams();
                            var currentNewsId = parseInt(urlParams['id']);
							//LoadView(prevNewsId, false);
							var view = LoadView(currentNewsId, domConstruct.create("DIV", null, dojo.byId('newslist'), "first"));
							ensureSlibingViewsPreloaded(view);
							setTimeout(function(){registry.byId('newsdetail'+currentNewsId).show();},100)
							//registry.byId('newsdetail'+currentNewsId).show();
                         });
						function LoadView(newsid, where)
						{

							var newView = new SwapView({
								id:'newsdetail'+newsid,
								selected:false
													   //});
							}, where);
							//win.body().addChild(newView);
							//domConstruct.place(newView, domConstruct.create("DIV", null, win.body()));
							attr.set(newView.containerNode, 'newsid', newsid);
							//newView.containerNode.innerHTML = 'NEWS VIEW' + newsid + '<br/>' + dojo.byId('newsDetailTemplate').innerHTML;
							newView.startup();
							var sp = new dojox.mobile.ScrollablePane(
							{
								id:'sp'+newsid
							});
							
							var pane = new dojox.mobile.ContentPane({
																	id:'cp'+newsid,
																href:'content/news-detail-test.html'	
																	});
							//sp.containerNode.addChild(pane);
							//var content = 'NEWS VIEW' + newsid + '<br/>' + dojo.byId('newsDetailTemplate').innerHTML;
							
							//sp.containerNode.innerHTML= content;
							newView.addChild(sp);
							pane.placeAt(sp); 
							//domConstruct.place(pane, sp, "first")
							//parser.parse(sp.containerNode);
							return newView;
						}
						
						topic.subscribe("/dojox/mobile/viewChanged", function (view) { 
							ensureSlibingViewsPreloaded(view);
							
							
						});
						function ensureSlibingViewsPreloaded(view)
						{
							var currentNewsId = parseInt(attr.get(view.containerNode, 'newsid'));
							var leftView = view.getPreviousSibling();
							if (leftView == null && currentNewsId > 0)
							{							
								var prevNewsId = currentNewsId -1;
								LoadView(prevNewsId, domConstruct.create("DIV", null, view.containerNode, "before"));
							}
							var rightView = view.getNextSibling();
							if (rightView == null && currentNewsId < 110)
							{							
								var nextNewsId = currentNewsId + 1;
								LoadView(nextNewsId, domConstruct.create("DIV", null, view.containerNode, "after"));
							}
							registry.byId('newsdetail'+currentNewsId).show();
						}

                    });