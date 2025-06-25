import getEmbedding from "./getEmbedding"
import getHindiEmbedding from "./HindiEmbedding"


export async function setVactor(bns) {
    // const vector = await getEmbedding(bns.section_content)
    console.log(bns)
    const vector = await getHindiEmbedding(bns.section_content)
    console.log(bns._id)
    const res = await fetch('/api/embed/helper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id:bns._id,
            vector: vector,
            payload: {section: bns.section, section_content:bns.section_content}
        })

    })
    return res
}

export async function vactorseter(act) {
    const bns=await fetch('/api/bns/bnshindi/sections')
    const data = await bns.json()
    const sections= data.sections
    // console.log(sections)
    if(sections){
       const res= processSectionsSequentially(sections, act);
       if (res){
           return "data set succsec"
       }
    }
    // setVactor(sections[0])
    return "data set faild"
    
}

async function processSectionsSequentially(sections, act) {
    // for (let item of sections) {
    //     try{
    //         await setVactor(item); 
    //         console.log('Set:', item.section);
    //     } catch {
    //         console.log("fail to set item", item)
    //     }
    //     // await new Promise(resolve => setTimeout(resolve, 2000));
    // }
    await setVactor(sections[act]); 
    console.log('All items processed', sections[act]);
}