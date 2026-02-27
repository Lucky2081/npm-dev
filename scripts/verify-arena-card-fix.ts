/**
 * Verify Arena Card Fix
 * This script verifies that the arena card styling has been properly applied
 */

import { readFileSync } from 'fs';

const filePath = 'app/[locale]/arena/arena-client.tsx';

console.log('🔍 Verifying Arena Card Styling Fix...\n');

try {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const checks = {
    cardHeight: false,
    lineClamp: false,
    bottomMargin: false,
    noFlexOne: false,
  };

  // Check each line
  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check 1: Card height should be 380px
    if (line.includes('h-[380px]') && line.includes('bg-white rounded-2xl p-7')) {
      checks.cardHeight = true;
      console.log(`✓ Line ${lineNum}: Card height is h-[380px]`);
    }

    // Check 2: Line clamp should be 4
    if (line.includes('line-clamp-4') && line.includes('leading-relaxed')) {
      checks.lineClamp = true;
      console.log(`✓ Line ${lineNum}: Description uses line-clamp-4`);
    }

    // Check 3: Bottom margin should be mb-4
    if (line.trim() === '<div className="mb-4">') {
      // Make sure it's NOT followed by flex-1
      const nextLine = lines[index + 1] || '';
      if (!nextLine.includes('flex-1')) {
        checks.bottomMargin = true;
        checks.noFlexOne = true;
        console.log(`✓ Line ${lineNum}: Description area uses mb-4 (without flex-1)`);
      }
    }
  });

  // Check for any remaining flex-1 in description area
  const hasFlexOne = content.includes('flex-1 mb-4');
  if (hasFlexOne) {
    checks.noFlexOne = false;
    console.log('✗ Found "flex-1 mb-4" - this should be just "mb-4"');
  }

  console.log('\n' + '='.repeat(50));
  console.log('VERIFICATION RESULTS:');
  console.log('='.repeat(50));

  if (checks.cardHeight) {
    console.log('✓ Card height: h-[380px]');
  } else {
    console.log('✗ Card height: NOT set to h-[380px]');
  }

  if (checks.lineClamp) {
    console.log('✓ Line clamp: line-clamp-4');
  } else {
    console.log('✗ Line clamp: NOT set to line-clamp-4');
  }

  if (checks.bottomMargin && checks.noFlexOne) {
    console.log('✓ Bottom spacing: mb-4 (without flex-1)');
  } else {
    console.log('✗ Bottom spacing: Issue detected');
  }

  console.log('='.repeat(50));

  if (Object.values(checks).every(v => v)) {
    console.log('\n✓ All checks passed! The fix has been properly applied.');
    console.log('\nIf you still see the old version, please:');
    console.log('1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)');
    console.log('2. Clear browser cache');
    console.log('3. Try incognito/private mode');
    console.log('4. Restart the dev server if needed');
    process.exit(0);
  } else {
    console.log('\n✗ Some checks failed. The fix may not be properly applied.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading file:', error);
  process.exit(1);
}
