(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientOtherInfoEntityController: function (scope, resourceFactory, routeParams, location, route) {

            scope.formData = {};
            scope.clientId = routeParams.clientId;
            scope.otherInfoData = {};
            scope.exists= false;
            scope.yearArrivedRequired = true;

            resourceFactory.clientOtherInfoTemplateResource.get({clientId:routeParams.clientId}, function(data){
                scope.strataOptions = data.strataOptions;
                scope.yearArrivedInHostCountryOptions = data.yearArrivedInHostCountryOptions;
            });

            resourceFactory.clientOtherInfoEntityResource.getAll({clientId:routeParams.clientId}, function(data){
                scope.otherInfoData = data[0];
                if(scope.otherInfoData){
                 scope.exists = true;
                }

            });

            scope.checkIfHostCommunitySelected = function () {
                if (scope.strataOptions && this.formData.strataId != undefined) {
                    var selectedObj = scope.strataOptions.filter(x => x.id === this.formData.strataId).at(0);
                    scope.yearArrivedRequired = !(selectedObj.name.toUpperCase() === 'HOST COMMUNITY');
                    return scope.yearArrivedRequired;
                } else {
                    scope.yearArrivedRequired = true;
                    return scope.yearArrivedRequired;
                }
            };

            scope.cancel = function () {
                location.path('/viewclient/' + scope.clientId);
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                resourceFactory.clientOtherInfoResource.save({clientId: scope.clientId}, this.formData, function (data) {
                    route.reload();
                });
            };

        }
    });
    mifosX.ng.application.controller('ClientOtherInfoEntityController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$route', mifosX.controllers.ClientOtherInfoEntityController]).run(function ($log) {
        $log.info("ClientOtherInfoEntityController initialized");
    });
}(mifosX.controllers || {}));
