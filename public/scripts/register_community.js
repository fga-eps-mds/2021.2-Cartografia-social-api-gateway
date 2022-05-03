$(function () {

    function fromToJSON(formArray) {
        var returnArray = {};
        for (var i = 0; i < formArray.length; i++) {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
        return returnArray;
    }


    function addAdminToCommunity(communityId, userEmail) {
        $.ajax({
            type: "GET",
            url: `/users/userByEmail?email=${userEmail}`,
            success: function ({ id }) {
                addUserToCommunity(communityId, id);
            }
        });
    }

    function addUserToCommunity(communityId, userId) {

        const user_community_payload = {
            userId: userId,
            communityId: communityId
        }

        $.ajax({
            type: "POST",
            url: `/community/addUser`,
            contentType: "application/json",
            data: JSON.stringify(user_community_payload),
            dataType: 'json',
            success: function () {
                giveAdminRights(user_community_payload);
            }
        });
    }

    function giveAdminRights(payload) {

        $.ajax({
            type: "POST",
            url: `/community/addAdminUser`,
            contentType: "application/json",
            data: JSON.stringify(payload),
            dataType: 'json',
            success: function () {
                window.location.reload(true);
            }
        });
    }

    $("#register_community").submit(function (e) {

        e.preventDefault();

        let form = $(this);
        let form_data = fromToJSON(form.serializeArray())
        const community_payload = {
            name: form_data.name,
            affiliation: form_data.affiliation,
            association: form_data.association,
            county: form_data.county,
            state: form_data.state,
            institution: form_data.institution
        }
        $.ajax({
            type: "POST",
            url: `/community`,
            contentType: "application/json",
            data: JSON.stringify(community_payload),
            dataType: 'json',
            success: function ({ id }) {
                addAdminToCommunity(id, form_data.user_email)
            }
        });
    });
});