/**
 * Created by ConMeoMauDen on 13/02/2014.
 */

var groupController = require('../../../app/controllers/users/setting');

module.exports = function(app, passport){
    /**
     * Get All Groups
     */
    app.get('/api/groups', groupController.getAllGroups);

    /**
     * create a new user group
     */
    app.post('/api/groups', groupController.createGroup);

    /**
     * find group
     */
    app.get('/api/groups/:id', groupController.findOneGroup);

    /**
     * update group
     */
    app.put('/api/groups/:id', groupController.updateGroup);

}
