import CustomMatcherResult = jest.CustomMatcherResult;
import expect = jest.Expect;

import { Sequence } from '@stechy1/diplomka-share';

import { SequenceEntity } from '@neuro-server/stim-feature-sequences/domain';

expect.extend({
  toMatchSequence(received: Sequence[], argument: SequenceEntity[]): CustomMatcherResult {
    expect(received).toHaveLength(argument.length);

    const count = received.length;

    for (let i = 0; i < count; i++) {
      const receivedSequence: Sequence = received[i];
      const expectedSequence: SequenceEntity = argument[i];

      expect(receivedSequence).toEqual(
        expect.objectContaining({
          experimentId: expectedSequence.experimentId,
          name: expectedSequence.name,
          created: expectedSequence.created,
          data: JSON.parse(expectedSequence.data) as number[],
          size: expectedSequence.size,
          tags: JSON.parse(expectedSequence.tags)
        } as Sequence)
      );
    }

    return {
      message: () => 'Sequence passing',
      pass: true
    };
  }
});
