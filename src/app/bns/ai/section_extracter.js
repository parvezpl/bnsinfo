

async function create_section(section, section_content) {
    const sections = await fetch('/api/bns/bnsenglish/sections', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // your data here
            section: section,
            section_content: section_content
        })

    })
    return sections
}

export async function section_extractor() {
    const res = await fetch('/api/bns/bnsenglish/bnsen')
    const data = await res.json()
    const bns = data.bns
    console.log(bns)
    bns.map((chapter) => {
        chapter.sections.map(item => {
            const responce= create_section(item.section,item.section_title )
            console.log(responce)
        })
    })

    return bns

}