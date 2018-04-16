/**
 * Prefix tester
 * Test if there are words begin with a prefix in a sentence
 * @param prefix: String
 * @param sentence: String
 * @returns Regexp matching result
 */

export default (prefix, sentence) => {
    const reg = (word => new RegExp(`(^${word}[^ ]* *)|( +${word})[^ ]* *`, "gi"))(prefix)
    return sentence.match(reg)
}