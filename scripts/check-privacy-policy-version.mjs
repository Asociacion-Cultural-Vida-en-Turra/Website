import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    base: { type: 'string' },
    head: { type: 'string' },
    config: { type: 'string' },
    page: { type: 'string' },
    'skip-label': { type: 'string' },
    labels: { type: 'string' },
  },
});

for (const name of ['base', 'head', 'config', 'page', 'skip-label', 'labels']) {
  if (!values[name]?.trim()) {
    console.error(`Missing required argument: --${name}`);
    process.exit(1);
  }
}

const labels = JSON.parse(values.labels);
if (!Array.isArray(labels) || !labels.every((label) => typeof label === 'string')) {
  console.error('--labels must be a JSON array of label names.');
  process.exit(1);
}
const skipLabel = values['skip-label'].trim();

if (labels.includes(skipLabel)) {
  console.log(`Manual exception: version check waived by the label \`${skipLabel}\`.`);
  process.exit(0);
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const { config, page, base, head } = values;
const changed = git('diff', '--name-only', `${base}...${head}`, '--', config, page);

if (!changed) {
  console.log('No privacy policy files changed.');
  process.exit(0);
}

const current = JSON.parse(git('show', `${head}:${config}`)).version;
const hasPrevious = git('ls-tree', '--name-only', base, '--', config);
const previous = hasPrevious ? JSON.parse(git('show', `${base}:${config}`)).version : 0;

if (!Number.isSafeInteger(current) || current <= 0 ||
    !Number.isSafeInteger(previous) || current <= previous) {
  console.error(`Privacy policy files changed. Increase version above ${previous} in ${config}. For a reviewed false positive, apply the ${skipLabel} label.`);
  process.exit(1);
}

console.log(`Privacy policy version increased: ${previous} → ${current}.`);
