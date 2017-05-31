var Configurations = {   
    current_driver_id : "", 
    current_vehicle_id : "",
    current_geo_fence_id : "",
    resize : function(odiv){
        var maxHeight = parseInt(0);
        $(odiv+" .row .col").each(function(){
            console.log(this);
            console.log("this.hegit is : "+$(this).height()+"maxHeight = "+maxHeight);
            if ($(this).height() > maxHeight) 
            { 
                maxHeight = $(this).height(); 
            }
        });
        $(odiv+" .row .col .card").height(maxHeight);
    },
    
    FabDisplay : function(changeTo) {
        if("HIDE" == changeTo) {
            $(".fab-button").hide();
        }if("SHOW" == changeTo) {
            $(".fab-button").show();
        }
    },
    addBinds : function()
    {
        //$(document).on('click','.edit-driver-button',viewDriverDetails.editDriverClicked); 
    }
        
};

