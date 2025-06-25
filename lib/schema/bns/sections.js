// models/Blog.js
import mongoose from 'mongoose';

const SectionsSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  section_content:{
    type:String,
    required:true
  }, 

  sub_section_content:{
    type:String,
  }, 
  
});

export default mongoose.models.Section || mongoose.model('Section', SectionsSchema);
