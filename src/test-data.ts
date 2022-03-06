export const factsAsText = `crime(attack,greg,sarah).
crime(steal,greg,courney).
crime(steal,steve,angel).

see(john,crime(attack,greg,sarah)).
see(rob,crime(steal,greg,courtney)).
see(bill,crime(steal,steve,angel)).

commit(Action,Person) :- crime(Action,Person,_).

% There are witnesses X of some people doing crime
witness(Witness) :-
  % Someone was observing some criminal action by another person
  see(Witness,crime(Action,Someone,_)),
  % Someone committed a crime.
  commit(Action,Someone).`;

const notEmpty = (s: string) => s !== '' && s !== '\n';

export const factsAsBlocks = (text) => text.split('\n\n').filter(notEmpty);
