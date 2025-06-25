import mongoose from 'mongoose';

const SectionsHindiSchema = new mongoose.Schema({
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

export default mongoose.models.Sectionhindi || mongoose.model('Sectionhindi', SectionsHindiSchema);