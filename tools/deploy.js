import { spawnSync } from 'node:child_process';
import { normalize } from 'node:path';

process.exit(
  spawnSync(
    normalize('./node_modules/.bin/ares-install'),
    [
      normalize(
        `./com.domain.kurdishtv_${process.env.npm_package_version}_all.ipk`
      )
    ],
    { stdio: 'inherit', shell: true }
  ).status ?? 0
);
