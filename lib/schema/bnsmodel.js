const mongoose = require('mongoose');


const BnsengishmodelSchema = new mongoose.Schema({
    sectionsx: {
        type: String,
        require: true,
    },
    section_embeddingsx:{
        type: String,
        require: true,
    },
},
)

export default mongoose.models.Bnsengishmodel || mongoose.model('Bnsengishmodel', BnsengishmodelSchema);
