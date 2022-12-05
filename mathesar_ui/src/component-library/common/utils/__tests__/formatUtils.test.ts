import { formatSize } from "../formatUtils";

test('formatSize',()=>{
expect(formatSize(0)).toBe('0 B')
expect(formatSize(2048)).toBe('2.00 KB')
})