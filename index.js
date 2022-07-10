const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mongo:mongodbatlas@bootcamp.wcsqh.mongodb.net/playground?retryWrites=true&w=majority')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
     name : { 
          type : String , 
          required : true,
          minlength : 5,
          maxlength :255,
     },
     category: {
          type: String,
          required : true,
          enum : ['web', 'mobile', 'network'],
          trim : true
     },
     author : String,
     tags : {
        type : Array,
        validate : {
          isAsync : true,
            validator : function(v, callback) {
               setTimeout(() => {
                  const result = v && v.length > 0;
                  callback(result); 

               },4000);
               
            },
            message : 'A course should have at least one tag.'
        }

     },
     date : { type : Date, default: Date.now },
     isPublished : Boolean,
     price : {
       type : Number,
       required : function () { return this.isPublished; },
       min : 10,
       max : 200,
       get : v => Math.round(v),
       set : v => Math.round(v)
     }
});

const Course = mongoose.model( 'Course', courseSchema);
async function createCourse() {
     const course = new Course ({
          name : 'angular Course',
          author : 'Mosh',
          tags : ['frontend'],
          isPublished : true,
          price : 11.3,
          category : 'web'
     });

     try {
          const result = await course.save();
          console.log(result);

     }
     
     catch (ex) {
          for (field in ex.errors)
          console.log(ex.errors[field].message);
     }
     
     }
createCourse();


async function getCourses() {
     const pageNumber = 2;
     const pageSize = 10;

     const courses = await Course
     .find({_id: '62c53108be7ac28534a9d8a2' })
     // .skip((pageNumber - 1) * pageSize)
     // .limit( pageSize )
     .sort({ name : 1})
     .select({ name : 1, tags: 1})
     .count();
     console.log(courses[0].price);
}

// getCourses();

async function updateCourse(id) {
  const course = await Course.findByIdAndUpdate(id , {
       $set: {
         author : 'Jackson',
         isPublished : false
       }
  }, {new : true});
 
  console.log(course);
}

updateCourse('62c23805b28ec766666be482');


async function removeCourse(id) {
//    const result = await Course.deleteOne({_id : id});
    const course = await Course.findByIdAndRemove(id);
   console.log(course);
   }
   
  


