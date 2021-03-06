(function () {
    angular.module( 'handleFormErrorsDirective', [
        'ngLocale'
    ] )
        .directive( 'handleFormErrors', handleFormErrorsDirective );

    handleFormErrorsDirective.$inject = [ '$locale' ];

    /**
     * Find the correct error message to display for a given input field
     * and display the error.
     *
     * @example
     * <form name = 'my-form'>
     *     <handle-form-errors input-field = 'my-email'>
     *     <input type = 'email' name = 'my-email'>
     * </form>
     */
    function handleFormErrorsDirective( $locale ) {
        return {
            restrict: 'E',
            template: '<div><span ng-if=hasError()>{{ getError() }}</span></div>',
            replace: true,
            require: '^form',
            scope: {
                inputField: '='
            },
            link: function ( scope, element, attributes, formCtrl ) {

                /**
                 * Error messages for different types of form
                 * errors provided by formCtrl[ fieldName ].$error
                 *
                 * To create custom error messages, create a global
                 * variable called errorTemplates.
                 */
                var errorTemplates = {
                    email: 'Invalid email address',
                    required: 'Required',
                    pattern: 'Invalid format'
                };

                var norwegianLocales = [ 'nb-no', 'no-no', 'no' ];

                // Use norwegian locale if that is used
                if ( norwegianLocales.indexOf( $locale.id ) !== -1 ) {
                    errorTemplates = {
                        email: 'Ugyldig epostadresse',
                        required: 'Påkrevd',
                        pattern: 'Ugyldig format'
                    };
                }

                // Load global error template if specified
                if ( window.errorTemplates ) {
                    errorTemplates = window.errorTemplates;
                }

                // Interface
                // ---------

                scope.formElement = getParentByTagName( element, 'form' );
                scope.form = formCtrl;
                scope.inputField = attributes.inputField;
                scope.hasError = hasError;
                scope.getError = getError;
                scope.element = element;

                // Implementation
                // --------------

                /**
                 * Check if the field has any errors
                 */
                function hasError() {
                    var field = scope.form[ scope.inputField ];
                    var errorFound = field && field.$touched && field.$error && Object.keys( field.$error ).length > 0;
                    return errorFound;
                }

                function getError() {

                    // Get the field from the form controller
                    var field = scope.form[ scope.inputField ];

                    // Get a list of all the errors found
                    var errors = Object.keys( field.$error ).filter( function ( key ) {
                        return field.$error[ key ];
                    } );

                    // Return the first template found
                    return errorTemplates[ errors[ 0 ] ];
                }

            }
        };
    }

    // Helper functions
    // ----------------

    /**
     * Get the first parent element with a given
     * jqLite or jQuery element with given name.
     *
     * @example
     * html:
     *     <form>
     *         <div>
     *             <input>{{ parent }}</input>
     *         </div>
     *     </form>
     * javascript:
     *     var input = angular.element( querySelector( 'input' ) );
     *     $scope.parent = getParentByTagName( input, 'form' );
     */
    function getParentByTagName( element, parentName ) {
        var resultElement = element;
        var iterationCount = 0;

        while ( resultElement.prop( 'tagName' ) !== parentName.toUpperCase() ) {
            resultElement = resultElement.parent();
            iterationCount++;

            if ( iterationCount === 100 ) {
                throw Error( 'Parent element ' + parentName + ' not found within 100 iterations.' );
            }
        }

        return resultElement;
    }
})();
