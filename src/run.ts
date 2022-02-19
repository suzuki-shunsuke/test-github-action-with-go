import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';
import * as path from 'path';

export const run = async (): Promise<void> => {
  const actionRef = core.getInput('action_ref');
  core.info(actionRef);
  await exec.exec('go', ['build', '-o', 'app', './cmd/app'], {
    cwd: path.dirname(__dirname),
  });
  await exec.exec(path.join(path.dirname(__dirname), 'app'));
}
