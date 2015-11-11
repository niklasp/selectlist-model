/**
 * selectlist-model
 * AngularJS directive for list of checkboxes
 * https://github.com/vitalets/selectlist-model
 * License: MIT http://opensource.org/licenses/MIT
 */

angular.module('selectlist-model', ['ngUnderscore'])
.directive('selectlistModel', ['$parse', '$compile', 'underscore', function($parse, $compile, underscore) {
  // contains
  function contains(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          return true;
        }
      }
    }
    return false;
  }

  // add
  function add(arr, item, comparator) {
    arr = angular.isArray(arr) ? arr : [];
      if(!contains(arr, item, comparator)) {
          arr.push(item);
      }
    return arr;
  }  

  // remove
  function remove(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          arr.splice(i, 1);
          break;
        }
      }
    }
    return arr;
  }

  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
     // exclude recursion, but still keep the model
    var selectlistModel = attrs.selectlistModel;
    attrs.$set("selectlistModel", null);
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);
    attrs.$set("selectlistModel", selectlistModel);

    // getter / setter for original model
    var getter = $parse(selectlistModel);
    var setter = getter.assign;
    var selectlistChange = $parse(attrs.selectlistChange);

    // value added to list
    var value = attrs.selectlistValue ? $parse(attrs.selectlistValue)(scope.$parent) : attrs.value;


    var comparator = angular.equals;

    if (attrs.hasOwnProperty('selectlistComparator')){
      if (attrs.selectlistComparator[0] == '.') {
        var comparatorExpression = attrs.selectlistComparator.substring(1);
        comparator = function (a, b) {
          return a[comparatorExpression] === b[comparatorExpression];
        };
        
      } else {
        comparator = $parse(attrs.selectlistComparator)(scope.$parent);
      }
    }

    // watch UI checked change
    scope.$watch(attrs.ngModel, function(newValue, oldValue) {
      if (newValue === oldValue) { 
        return;
      } 
      var current = getter(scope.$parent);
      if (angular.isFunction(setter)) {
        if (contains(current, oldValue, comparator)) {
          setter(scope.$parent, add(current, newValue, comparator));
          setter(scope.$parent, remove(current, oldValue, comparator));
          // setter(scope.$parent, remove(current, oldValue, comparator));
        } else {
          setter(scope.$parent, add(current, newValue, comparator));
        }
      }

      if (selectlistChange) {
        selectlistChange(scope);
      }
    });
    
    // declare one function to be used for both $watch functions
    function setChecked(newArr, oldArr) {
      //scope[attrs.ngModel] = contains(newArr, value, comparator);
      console.log('scope', scope.$parent.atr.children);
      var elementsChildren = scope.$parent.atr.children;
      //if the children contain the value in the array, set it
      
      var selecOptionIds = underscore.pluck(elementsChildren, 'id');
      for (var i = 0; i < selecOptionIds.length; i++) {
        if (contains(newArr, selecOptionIds[i], comparator)) {
          scope[attrs.ngModel] = selecOptionIds[i];
        }
      }
    }

    // watch original model change
    // use the faster $watchCollection method if it's available
    if (angular.isFunction(scope.$parent.$watchCollection)) {
        scope.$parent.$watchCollection(selectlistModel, setChecked);
    } else {
        scope.$parent.$watch(selectlistModel, setChecked, true);
    }
  }

  return {
    restrict: 'A',
    priority: 1000,
    terminal: true,
    scope: true,
    compile: function(tElement, tAttrs) {
      if ((tElement[0].tagName !== 'SELECT' )) {
        throw 'selectlist-model should be applied to `<select>` .';
      }

      // by default ngModel is 'checked', so we set it if not specified
      if (!tAttrs.ngModel) {
        // local scope var storing individual checkbox model
        tAttrs.$set("ngModel", "local");
      }

      return postLinkFn;
    }
  };
}]);
