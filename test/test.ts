import {describe, it, afterEach, beforeEach} from 'mocha';
import * as sinon from 'sinon';
import * as assert from 'assert';
import * as nock from 'nock';
import * as core from '@actions/core';
// import {main} from '../src/index';

nock.disableNetConnect();

describe('notifier', () => {
  beforeEach(() => {
    sinon.stub(core, 'setFailed').callsFake(output => {
      if (typeof output === 'string') {
        throw new Error(output);
      } else {
        throw output;
      }
    });
  });
  afterEach(() => {
    sinon.restore();
    nock.cleanAll();
  });
  it('should send an email with given inputs', async () => {
    const email = 'Justin Beckwith <justin.beckwith@gmail.com>';
    const inputStub = sinon.stub(core, 'getInput');
    inputStub.withArgs('from').returns(email);
    inputStub.withArgs('to').returns(email);
    inputStub.withArgs('subject').returns('subjecty');
    inputStub.withArgs('body').returns('mrbody');
    inputStub.withArgs('serviceAccountJson').returns('{}');
    assert.ok(true);
  });
});
