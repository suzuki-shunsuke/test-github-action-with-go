import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import got from 'got';
import {promisify} from 'util';
import stream from 'node:stream';

interface downloadOpt {
  actionRef: string
  platform: string
  arch: string
  binPath: string
}

function download(opt: downloadOpt): Promise<void> {
  const pipeline = promisify(stream.pipeline);
  const assetURL = `https://github.com/suzuki-shunsuke/test-github-action-with-go/releases/download/${opt.actionRef}/app_${opt.platform}_${opt.arch}`;

  return pipeline(
    got.stream(assetURL),
    fs.createWriteStream(opt.binPath, {
      mode: 0o700,
    }),
  );
}

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

  await download({
    actionRef: actionRef,
    platform: process.platform,
    arch: process.arch,
    binPath: binPath,
  });
  await exec.exec(binPath);
}
