const viewRouter = require('express').Router();
const viewController = require('../controllers/viewController');


viewRouter.get('/:id',function(req,res,next){
    viewController.getViewUser(req,res,next);


});
viewRouter.get('/:id/image',function(req,res,next){
    viewController.getViewImages(req,res);
})

viewRouter.get('/:id/pdf',function(req,res){
    viewController.getViewDocuments(req,res);
})


viewRouter.get('/:id/avatar',function(req,res){
    viewController.getViewAvatar(req,res);
})

viewRouter.get("/:id/experience", async (req,res)=>{
    viewController.getViewExperiences(req,res);
});

viewRouter.get('/:id/course',(req,res)=>{
    viewController.getViewCourses(req,res);
});

viewRouter.get('/:id/project',(req,res)=>{
    viewController.getViewProjects(req,res);
});
viewRouter.post('/:id/project/conditional',(req,res)=>{
    viewController.getViewProjectCondition(req,res);
});

viewRouter.get('/:id/project/:project_id',(req,res)=>{
    viewController.getViewProject(req,res);
});


module.exports = viewRouter;
