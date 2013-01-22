var lastNewsId = 0;
                require(
						[
						 "dojo/ready"
						 ,"dijit/registry"
						 , "dojo/dom-attr"
						 ,"dojox/mobile/ListItem"
						 ,"dojox/mobile/RoundRectList"
						 
                    ], function(ready, registry, attr, ListItem){
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
							slideToNews = function(id)
							{
								slideTo('news-detail.html?id='+id);
							}
                         });
						function LoadMoreNews(){
							var list = registry.byId("newslistvl");
							var loadingMore = registry.byId("loadingMore");
							var content = dojo.byId('newslisttemplate').innerHTML;
							
							list.removeChild(loadingMore);
                                    for(var i = 1; i <= 10; i++){

                                        var item1 = new ListItem({
											label: content,
											variableHeight: true,
											href:'news-detail.html?id='+lastNewsId
											
                                        });
										
                                        list.addChild(item1);
                                        lastNewsId++;
                                    }
									list.addChild(loadingMore);
							}
							
                    });