import * as core from '@actions/core'
import { Util } from './util'

export namespace Action {
  export async function run() {
    try {
      if (
        Util.isValidEvent('pull_request', 'opened') ||
        Util.isValidEvent('pull_request', 'closed') ||
        Util.isValidEvent('pull_request', 'edited') ||
        Util.isValidEvent('pull_request', 'reopened') ||
        Util.isValidEvent('pull_request', 'synchronize') ||
        Util.isValidEvent('pull_request', 'ready_for_review') ||
        Util.isValidEvent('pull_request_review', 'submitted') ||
        Util.isValidEvent('pull_request_review', 'dismissed')
      ) {
        const octokit = Util.getOctokit()
        await Util.ensureLabels(octokit)
        const state = await Util.getState(octokit)
        if (state) {
          Util.updateLabel(octokit, state)
        } else {
          throw new Error('Undefined state')
        }
      }
    } catch (e) {
      core.error(e)
      core.setFailed(e.message)
    }
  }
}
