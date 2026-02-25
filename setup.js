#!/usr/bin/env node

async function main() {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const childProcess = await import('node:child_process');

  const { execSync } = childProcess;
  const projectRoot = process.cwd();
  const envPath = path.join(projectRoot, '.env.local');

  const run = (command, label) => {
    console.log(`\n▶ ${label}`);
    execSync(command, { stdio: 'inherit' });
  };

  const runAndCapture = (command) => {
    return execSync(command, { encoding: 'utf8' }).trim();
  };

  const parseEnvOutput = (envOutput) => {
    const result = {};
    for (const line of envOutput.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
        continue;
      }

      const [key, ...rest] = trimmed.split('=');
      result[key] = rest.join('=').trim();
    }
    return result;
  };

  const writeOrUpdateEnv = (filePath, values) => {
    const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
    const lines = existing ? existing.split('\n') : [];

    const updateKey = (key, value) => {
      const nextLine = `${key}=${value}`;
      const index = lines.findIndex((line) => line.startsWith(`${key}=`));
      if (index >= 0) {
        lines[index] = nextLine;
      } else {
        lines.push(nextLine);
      }
    };

    updateKey('NEXT_PUBLIC_SUPABASE_URL', values.API_URL);
    updateKey('NEXT_PUBLIC_SUPABASE_ANON_KEY', values.ANON_KEY);

    fs.writeFileSync(filePath, `${lines.filter(Boolean).join('\n')}\n`, 'utf8');
  };

  try {
    run('npm install', 'Installing npm dependencies');
    run('npx supabase start', 'Starting Supabase local services');

    console.log('\n▶ Reading local Supabase credentials');
    const envOutput = runAndCapture('npx supabase status -o env');
    const values = parseEnvOutput(envOutput);

    if (!values.API_URL || !values.ANON_KEY) {
      throw new Error('Could not extract API_URL or ANON_KEY from `supabase status -o env`.');
    }

    writeOrUpdateEnv(envPath, values);
    console.log(`✔ Updated ${path.basename(envPath)} with local Supabase credentials`);

    run('npx supabase db reset', 'Applying migrations via db reset');

    console.log('\nSetup complete. Next steps:');
    console.log('- Run `npm run dev`');
    console.log('- Open `http://localhost:3000`');
  } catch (error) {
    console.error('\nSetup failed.');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void main();
