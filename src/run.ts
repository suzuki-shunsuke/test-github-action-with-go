import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import got from 'got';
import {promisify} from 'util';
import stream from 'node:stream';

export const run = async (): Promise<void> => {
  const refPattern = /v[0-9.-]+/;
  const actionRef = core.getInput('action_ref');
  core.info(actionRef);
  const binPath = path.join(__dirname, 'app');
  if (!refPattern.test(actionRef)) {
    await exec.exec('go', ['build', '-o', 'dist/app', './cmd/app'], {
      cwd: path.dirname(__dirname),
    });
    await exec.exec(binPath);
    return;
  }

  const pipeline = promisify(stream.pipeline);
  const assetURL = `https://github.com/${process.env.GITHUB_REPOSITORY}/releases/download/${actionRef}/app_${process.platform}_${process.arch}`;

  await pipeline(
    got.stream(assetURL),
    fs.createWriteStream(binPath),
  );
  await exec.exec(binPath);
}
