/*
 * adapt-clickAndLearn
 * License - http://github.com/adaptlearning/adapt_framework/LICENSE
 * Maintainers - Aniket Dharia <aniket.dharia@credipoint.com>
 */
define(function(require) {
    var ComponentView = require('coreViews/componentView');
	var Adapt = require('coreJS/adapt');

    var ClickAndLearn = ComponentView.extend({
        events: {
            'click .clickAndLearn-indicator' : 'onClickDisplayItem',
            'click .clickAndLearn-indicator-img' : 'onClickDisplayItem',
            'click .clickAndLearn-popup-close' : 'onClickCloseItem'
        },
        preRender: function () {
            this.listenTo(Adapt, 'device:resize', this.resizeControl, this);
            this.setDeviceSize();
        },
        /* this function called on triggering of device resize event of Adapt */
        resizeControl: function() {
            this.setDeviceSize();
            var tabViewContainer = this.$el.find('div#tabViewContainer');
            if(this.model.get('_isDesktop')) {
                tabViewContainer.show();
            } else {
                tabViewContainer.hide();
            }
        },
        /* set component variable according to size of screen */
        setDeviceSize: function() {
            if (Adapt.device.screenSize === 'large') {
                this.$el.addClass('desktop').removeClass('mobile');
                this.model.set('_isDesktop', true);
            } else {
                this.$el.addClass('mobile').removeClass('desktop');
                this.model.set('_isDesktop', false)
            }
        },
        /* this is use to set component element and status on postRender */
        postRender: function() {
            this.$el.find('.clickAndLearn-indicator:first').addClass('clickAndLearn-indicatorActive');
            this.setDeviceSize();
            if(this.model.get('_isDesktop')) {
                this.$el.find(".clickAndLearn-tabViewContainer").show();
            } else {
                this.$el.find('.clickAndLearn-tabViewContainer').hide();
            }
            this.$el.find('.clickAndLearn-tabItem:first').css('display', 'hidden');
            this.setReadyStatus();
        },
        /* handler function for click event on indicator element */
        onClickDisplayItem: function (event) {
            event.preventDefault();
            var selectedElement = $(event.target);
            var selectedElementId = selectedElement.attr('id');
            var idNumber = selectedElementId[selectedElementId.lastIndexOf('-') + 1];
            var mainContainer = selectedElement.closest('.clickAndLearn-wrapper');

            mainContainer.find('.clickAndLearn-navContainer .clickAndLearn-indicator').removeClass('clickAndLearn-indicatorActive');
            if(selectedElementId.indexOf("tabItemIndicatorImage-") == 0) {
                selectedElement.closest('.clickAndLearn-indicator').addClass('clickAndLearn-indicatorActive');
            } else {
                selectedElement.addClass('clickAndLearn-indicatorActive');
            }
            mainContainer.find('.clickAndLearn-tabViewContainer .clickAndLearn-tabItem').hide();
            mainContainer.find('.clickAndLearn-tabViewContainer #tabItem-'+idNumber).show();

            if(!this.model.get("_isDesktop")) {
                var popup = this.$el.find('.clickAndLearn-popup');
                popup.removeClass('clickAndLearn-hidden');

                popup.find('.clickAndLearn-popup-toolbar-title').hide();
                popup.find('.clickAndLearn-popup-content').hide();

                popup.find('.clickAndLearn-popup-toolbar-title:eq('+idNumber+')').show();
                popup.find('.clickAndLearn-popup-content:eq('+idNumber+')').show();
                /*popup.find('#clickAndLearn-popup-toolbar-title-'+idNumber).show();
                popup.find('#clickAndLearn-popup-content-'+idNumber).show();*/
            }
            this.setVisited(idNumber);
        },
        /* handler function on click of pop-close */
        onClickCloseItem: function (event) {
            event.preventDefault();
            this.$el.find('.clickAndLearn-popup-close').blur();
            this.$el.find('.clickAndLearn-popup').addClass('clickAndLearn-hidden');
        },
        setVisited: function(index) {
            var item = this.model.get('items')[index];
            item._isVisited = true;
            this.checkCompletionStatus();
        },
        getVisitedItems: function() {
            return _.filter(this.model.get('items'), function(item) {
                return item._isVisited;
            });
        },
        /* this function will check or set the completion status of current component. */
        checkCompletionStatus: function() {
            if (!this.model.get('_isComplete')) {
                if (this.getVisitedItems().length == this.model.get('items').length) {
                    this.setCompletionStatus();
                }
            }
        }
    });

    Adapt.register("clickAndLearn", ClickAndLearn);
    return ClickAndLearn;
});