var lastmypgpsId = 0;
                require(
						[
						 "dojo/ready"
						 ,"dijit/registry"
						 ,"dojox/mobile/ListItem"
						 ,"dojox/mobile/RoundRectList"
						 
                    ], function(ready, registry, ListItem){
                        ready(function(){
							LoadMoremygps();
                            var mygpslistvsw = registry.byId('mygpslistvsw');
                            mygpslistvsw.adjustDestination = function(to, pos){
                                var dim = this.getDim();
                                var ch = dim.c.h; 
                                var dh = dim.d.h; 
                                if(to.y < dh - ch + 100){ 
                                    LoadMoremygps();
                                }
                            }
							
                         });
						function LoadMoremygps(){
							var list = registry.byId("mygpslistvl");
							var loadingMore = registry.byId("loadingMore");
							var content = dojo.byId('mygpslisttemplate').innerHTML;
							
							list.removeChild(loadingMore);
                                    for(var i = 1; i <= 10; i++){

                                        var item1 = new ListItem({
                                            icon: "images/i-icon-1.png",
                                            //label: 'mygps VIEW' + lastmypgpsId + '<br/>' + content,
											label: content,
											variableHeight: true,
											href:"my-gps-detail.html?id="+lastmypgpsId,
                                        });
                                        list.addChild(item1);
                                        lastmypgpsId++;
                                    }
									list.addChild(loadingMore);
							}
							
                    });