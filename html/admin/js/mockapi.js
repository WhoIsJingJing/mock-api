(function() {

    angular.module('mockApp', ['ngRoute', 'ngResource'])
        .constant('version', 'v0.1.0')
        .config(function($locationProvider, $routeProvider, $httpProvider) {

            $routeProvider.when('/', {
                templateUrl: '/main.html',
                controller: 'MainCtrl'
            }).otherwise({
                redirectTo: '/'
            });
            // use the HTML5 History API
            $locationProvider.html5Mode(false);

        })
        .directive('jsoneEitor', ['$resource', 'jsoneditorSrv', function($resource, jsoneditorSrv) {
            return {
                restrict: 'AEC',
                replace: false,
                template: '<div></div>',
                scope: {},
                transclude: true,
                controller: function($scope, $element, $attrs, $transclude) {
                    jsoneditorSrv._init($element[0]);
                },
                link: function($scope, $element, $attrs) {}
            };
        }])
        .factory('jsoneditorSrv', ['$resource',
            function($resource) {
                'use strict';

                var factory = {
                    jsoneditor: {},
                    options: {
                        mode: 'code',
                        modes: ['code', 'form', 'text', 'tree', 'view'],
                    },
                    jsonData: ''
                }

                factory._init = function(container) {
                    var self = this;
                    self.jsoneditor = new JSONEditor(container, self.options);
                    // editor.set(json);
                }

                factory._setJson = function(json) {
                    var self = this;
                    self.jsonData = json;
                    self.jsoneditor.set(json);

                }

                factory._getJson = function() {
                    var self = this;
                    var jsondata = self.jsoneditor.get();
                    return jsondata;
                };
                factory.getJSON = function() {
                    var self = this;
                    return self._getJson();
                }
                factory.setJSON = function(json) {
                    var self = this;
                    return self._setJson(json);
                }
                factory.changeOpt = function() {
                    var self = this;

                };

                return factory;
            }
        ])
        .controller('MainCtrl', ["$scope", "$location", "version", "$resource", "jsoneditorSrv",
             function($scope, $location, version, $resource, jsoneditorSrv) {
                $scope.$path = $location.path.bind($location);
                $scope.version = version;


                $scope.info = {
                    apis: [],
                    currentEdit: ""
                }


                $scope._getApis = function() {
                    var apis = $resource("/editor/api/list")
                    apis['get']().$promise.then(function(response) {
                        if (response.status == 0) {
                            $scope.info.apis = response.result || []
                        }
                    })
                }

                $scope.apiRefresh = function() {
                    $scope._getApis();
                }

                $scope.apiEditItem = function(apisItem) {
                    var apis = $resource("/editor/api/edit")
                    apis['get']({
                        url: apisItem
                    }).$promise.then(function(response) {
                        if (response.status == 0) {
                            jsoneditorSrv.setJSON(response.result)
                            $scope.info.currentEdit = apisItem;
                        }
                    })
                }

                $scope.apiAddItem = function() {
                    swal({
                        title: "添加新的API",
                        text: "api前缀为：/api/",
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: true,
                        animation: "slide-from-top",
                        inputPlaceholder: "",
                        showLoaderOnConfirm: true
                    }, function(url) {
                        if (url) {
                            var apis = $resource("/editor/api/save")
                            var jsondata = jsoneditorSrv.getJSON()
                            apis['save']({
                                url: "/api/" + url,
                                json: {}
                            }).$promise.then(function(response) {
                                if (response.status == 0) {
                                    $scope.info.apis = response.result
                                }
                            })
                        }
                    });
                }

                $scope.apiSaveItem = function(apiSaveItem) {
                    var apis = $resource("/editor/api/save")
                    var jsondata = jsoneditorSrv.getJSON()
                    apis['save']({
                        url: apiSaveItem,
                        json: jsondata
                    }).$promise.then(function(response) {
                        if (response.status == 0) {
                            $scope.info.apis = response.result
                            swal({
                                title: "保存成功!",
                                text: "api " + apiSaveItem,
                                type: "success",
                                timer: 2000,
                                showConfirmButton: true
                            });
                        } else {
                            swal({
                                title: "保存失败!",
                                text: "api " + apiSaveItem,
                                type: "warning",
                                timer: 2000,
                                showConfirmButton: true
                            });
                        }
                    })
                }

                $scope.apiRemoveItem = function(apisItem) {
                    swal({
                        title: "删除API",
                        text: "需要删除API：" + apisItem,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function(isConfirm) {
                        if (isConfirm) {
                            var apis = $resource("/editor/api/del")
                            apis['get']({
                                url: apisItem
                            }).$promise.then(function(response) {
                                if (response.status == 0) {
                                    $scope.info.apis = response.result
                                    swal({
                                        title: "删除成功!",
                                        text: "已经从数据库中移除 " + apisItem,
                                        type: "success",
                                        timer: 2000,
                                        showConfirmButton: true
                                    });
                                }
                            })
                        }
                    });
                }

                $scope._getApis();
        }]);
})()
