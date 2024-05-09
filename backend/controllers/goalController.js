const asyncHandler = require ('express-async-handler')
const  Goal = require ('../models/goalModel')
const  User = require ('../models/userModel')

//@desc Get goals
//@route Get /api/goals
//@access Private
const getGoals = asyncHandler (async(req, res) => {  
    const goals = await Goal.find({ user: req.user.id })
    res.status(200).json(goals)
})

//@desc Set goals
//@route POST /api/goals
//@access Private
const setGoal = asyncHandler (async (req, res) => {  
    if (!req.body.text){
    res.status(400)
    throw new Error({message: "Please add a text field"})
   } 
   const goal  = await Goal.create ({
    text: req.body.text,
    user: req.user.id,
   })
    res.status(200).json(goal)
})

//@desc UPDATE goals
//@route PUT /api/goals
//@access Private
const updateGoal = asyncHandler (async (req, res) => { 
    const goal = await Goal.findById (req.params.id)
    if (!goal){
        res.status(400)
        throw new Error( 'Goal not found' )
    }

     const user = await User.findById (req.user.id)

    //check for user
    if (!req.user){
        res.status(401)
        throw new Error ('User Not found')
     }
     // login user matches goal user 
     if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
     }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedGoal)
})


//@desc DELETE goals
//@route DELETE /api/goals
//@access Private
const deleteGoal = asyncHandler (async (req, res) => {  
    const goal = await Goal.findById (req.params.id) 

    if (!goal){
        res.status(400)
        throw new Error({message: 'Goal not found'})
    }

    //check for user
    if (!req.user){
        res.status(401)
        throw new Error ('User Not found')
     }
     // to verify is login user matches User goal Id 
     if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
     }

    await Goal.deleteOne()

    res.status(200).json({  id: req.params.id  })
})


module.exports = {
    getGoals,
    setGoal,
    updateGoal, 
    deleteGoal,
} 