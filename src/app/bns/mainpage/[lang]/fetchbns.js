import { isHTMLElement } from "framer-motion"

export async function FetchEnglishData() {
    const res = await fetch('/api/bns/bnsenglish/bnsen')
    const json = await res.json()

    return json.bns
}

export async function FetchHindiData() {
    const res = await fetch('/api/bns/bnshindi/bnshi')
    const json = await res.json()
    if (!json.bns) return console.log("data not found ")
    const chapters = json.bns.map(item => {
        return item.chapter
    })
    const chaptersSort = chapters.sort()
    const sortdata = chaptersSort.map(chapter => {
        const data = json.bns.filter(item => {
            if (chapter === item.chapter)
                return item
        })[0]
        return data
    })
    // console.log(json.bns)
    return sortdata
}

