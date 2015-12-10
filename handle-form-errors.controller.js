angular.module( 'handleFormErrorsDirective' )
    .controller( 'HandleFormErrorsController', HandleFormErrorsController );

function HandleFormErrorsController( $log ) {
    $log.log( 'Started HandleFormErrorsController' );
}
