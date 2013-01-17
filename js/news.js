var lastId = 0;
                require(
						[
						 "dojo/ready"
						 ,"dijit/registry"
						 ,"dojox/mobile/ListItem"
						 ,"dojox/mobile/EdgeToEdgeList"
						 
                    ], function(ready, registry, ListItem){
                        ready(function(){
							LoadMoreNews();
                            var newslistvsw = registry.byId('newslistvsw');
                            newslistvsw.adjustDestination = function(to, pos){
                                var dim = this.getDim();
                                var ch = dim.c.h; 
                                var dh = dim.d.h; 
                                if(to.y < dh - ch + 100){ 
                                    LoadMoreNews();
                                }
                            }
							
                         });
						function LoadMoreNews(){
							var list = registry.byId("newslistvl");
							var loadingMore = registry.byId("loadingMore");
							var content = dojo.byId('newslisttemplate').innerHTML;
							
							list.removeChild(loadingMore);
                                    for(var i = 1; i <= 10; i++){

                                        var item1 = new ListItem({
                                            icon: "images/i-icon-1.png",
                                            //label: 'NEWS VIEW' + lastId + '<br/>' + content,
											label: content,
											variableHeight: true,
											href:"news-detail.html?id="+lastId,
                                        });
                                        list.addChild(item1);
                                        lastId++;
                                    }
									list.addChild(loadingMore);
							}
							
                    });