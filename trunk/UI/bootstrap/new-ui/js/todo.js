/**
 * Created by Là1 on 1/15/14.
 */
$(document).ready(function () {
        var elems = document.getElementsByTagName("input"), i;
        for (i in elems) {
            if (elems[i].type == "checkbox") {

                if (elems[i].checked) //alert(this.id + " is checked");
                //if (elems[i].checked)
                    $("label[for=" + elems[i].id + "]").css("text-decoration", "line-through");
                else $("label[for=" + elems[i].id + "]").css("text-decoration", "none");

                $("#" + elems[i].id).change(function () {
                    if ($(this).is(':checked')) //alert(this.id + " is checked");
                    //if (elems[i].checked)
                        $("label[for=" + this.id + "]").css("text-decoration", "line-through");
                    else $("label[for=" + this.id + "]").css("text-decoration", "none");
                    //alert(elems[i].id + " is not checked");
                });
            }
        }
    }
)
;
