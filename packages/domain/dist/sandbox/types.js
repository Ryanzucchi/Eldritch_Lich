"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareSandboxWithCanonical = compareSandboxWithCanonical;
/**
 * Compara as alterações hipotéticas do Sandbox com os dados do universo canônico (UC-405).
 */
function compareSandboxWithCanonical(changes) {
    const modifiedCount = changes.length;
    const unmergedCount = changes.filter(c => !c.isMerged).length;
    return {
        modifiedCount,
        unmergedCount,
        summary: `O ambiente sandbox possui ${modifiedCount} alteração(ões) hipotética(s) em relação ao universo canônico.`
    };
}
