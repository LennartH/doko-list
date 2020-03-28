import { $enum } from 'ts-enum-util';
import { AnnouncementBehaviour, BockroundAfter, BonusScore } from './common';
import { RoundData } from './round-data';
import { RuleSetConfig, RuleSet } from './rule-set';

const completeConfig: RuleSetConfig = {
  announcementBehaviour: undefined,
  losingAnnouncementsGivesScore: true,
  soloWinsOnTie: true,
  losingPartyGetsNegatedScore: true,
  bonusScoreRules: $enum(BonusScore).getValues(),
  bonusScoresOnSolo: true,
  bockroundAfter: $enum(BockroundAfter).getValues(),
  consecutiveBockroundsStack: true
};

const reWon = {
  name: 're won',
  builder: RoundData.create().withRePoints(140)
};
const reWonWithDoppelkopf = {
  name: 're won with doppelkopf',
  builder: RoundData.create()
    .withRePoints(140)
    .withDoppelkopfsBy('re')
};
const reWonButContraDoppelkopf = {
  name: 're won, but contra got doppelkopf',
  builder: RoundData.create()
    .withRePoints(140)
    .withDoppelkopfsBy('contra')
};
const reWonButContraDoppelkopfAndCaughtCharlie = {
  name: 're won, but contra got doppelkopf and caught charlie',
  builder: RoundData.create()
    .withRePoints(140)
    .withDoppelkopfsBy('contra')
    .charlyCaughtBy('contra')
};
const reWonBig = {
  name: 're won big',
  builder: RoundData.create().withRePoints(239)
};

const contraWon = {
  name: 'contra won',
  builder: RoundData.create().withContraPoints(140)
};
const contraWonSchwarz = {
  name: 'contra won',
  builder: RoundData.create().withRePoints(0)
};
const contraWonWithCapturedDulle = {
  name: 'contra won with captured dulle',
  builder: RoundData.create()
    .withContraPoints(140)
    .dulleCapturedBy('contra')
};
const contraWonWithLastTrickByFox = {
  name: 'contra won with last trick by fox',
  builder: RoundData.create()
    .withContraPoints(140)
    .lastTrickWithFoxBy('contra')
};
const contraWonWithLastTrickByCharly = {
  name: 'contra won with last trick by charly',
  builder: RoundData.create()
    .withContraPoints(140)
    .lastTrickWithCharlyBy('contra')
};

const scoreTied = {
  name: 'scores tied',
  builder: RoundData.create().withContraPoints(120)
};

const soloWon = {
  name: 'solo won',
  builder: RoundData.create()
    .solo()
    .withRePoints(140)
};
const soloWonWithDoppelkopf = {
  name: 'solo won with doppelkopf',
  builder: RoundData.create()
    .solo()
    .withRePoints(140)
    .withDoppelkopfsBy('re')
};
const soloLost = {
  name: 'solo lost',
  builder: RoundData.create()
    .solo()
    .withContraPoints(140)
};
const soloLostButCaughtFox = {
  name: 'solo lost but caught fox',
  builder: RoundData.create()
    .solo()
    .withContraPoints(140)
    .foxCaughtBy('re')
};
const soloTies = {
  name: 'solo ties',
  builder: RoundData.create()
    .solo()
    .withRePoints(120)
};
const soloTiesWithAnnouncement = {
  name: 'solo ties with announcement',
  builder: RoundData.create()
    .solo()
    .withRePoints(120)
    .withReAnnouncement()
};

const reWonWithAnnouncementLessThan90 = {
  name: 're won with announcement less than 90',
  builder: RoundData.create()
    .withContraPoints(89)
    .withReAnnouncement({ lessThan: 90 })
};
const reWonWithAnnouncementSchwarz = {
  name: 're won with schwarz announcement',
  builder: RoundData.create()
    .withContraPoints(0)
    .withReAnnouncement({ lessThan: 0 })
};
const reWonWithAnnouncementLessThan90AndContraAnnouncement = {
  name: 're won with announcement less than 90 and contra announcement',
  builder: RoundData.create()
    .withContraPoints(89)
    .withReAnnouncement({ lessThan: 90 })
    .withContraAnnouncement()
};
const reLostWithAnnouncementLessThan90 = {
  name: 're lost with announcement less than 90',
  builder: RoundData.create()
    .withContraPoints(90)
    .withReAnnouncement({ lessThan: 90 })
};

const reWonInBockround = {
  name: 're won in bockround',
  builder: RoundData.create()
    .bockround()
    .withRePoints(140)
};
const reWonInTripleBockround = {
  name: 're won in third consecutive bockround',
  builder: RoundData.create()
    .withConsecutiveBockrounds(3)
    .withRePoints(140)
};

// TODO More tests
describe(`RuleSet using announcement behaviour ${AnnouncementBehaviour.FirstGetsPlusTwo}`, () => {
  [
    { data: reWon, expected: { re: 1, contra: -1, isBockroundNext: false } },
    { data: reWonWithDoppelkopf, expected: { re: 2, contra: -2, isBockroundNext: false } },
    { data: reWonButContraDoppelkopf, expected: { re: 0, contra: -0, isBockroundNext: true } },
    { data: reWonButContraDoppelkopfAndCaughtCharlie, expected: { re: -1, contra: 1, isBockroundNext: false } },
    { data: reWonBig, expected: { re: 4, contra: -4, isBockroundNext: false } },

    { data: contraWon, expected: { re: -2, contra: 2, isBockroundNext: false } },
    { data: contraWonSchwarz, expected: { re: -6, contra: 6, isBockroundNext: true } },
    { data: contraWonWithCapturedDulle, expected: { re: -3, contra: 3, isBockroundNext: false } },
    { data: contraWonWithLastTrickByFox, expected: { re: -3, contra: 3, isBockroundNext: false } },
    { data: contraWonWithLastTrickByCharly, expected: { re: -3, contra: 3, isBockroundNext: false } },

    { data: scoreTied, expected: { re: -2, contra: 2, isBockroundNext: true } },

    { data: soloWon, expected: { re: 3, contra: -1, isBockroundNext: true } },
    { data: soloWonWithDoppelkopf, expected: { re: 6, contra: -2, isBockroundNext: true } },
    { data: soloLost, expected: { re: -6, contra: 2, isBockroundNext: true } },
    { data: soloLostButCaughtFox, expected: { re: -3, contra: 1, isBockroundNext: true } },
    { data: soloTies, expected: { re: 3, contra: -1, isBockroundNext: true } },
    { data: soloTiesWithAnnouncement, expected: { re: -9, contra: 3, isBockroundNext: true } },

    { data: reWonWithAnnouncementLessThan90, expected: { re: 5, contra: -5, isBockroundNext: false } },
    { data: reWonWithAnnouncementSchwarz, expected: { re: 11, contra: -11, isBockroundNext: true } },
    { data: reWonWithAnnouncementLessThan90AndContraAnnouncement, expected: { re: 6, contra: -6, isBockroundNext: true } },
    { data: reLostWithAnnouncementLessThan90, expected: { re: -4, contra: 4, isBockroundNext: true } },

    { data: reWonInBockround, expected: { re: 2, contra: -2, isBockroundNext: false } },
    { data: reWonInTripleBockround, expected: { re: 8, contra: -8, isBockroundNext: false } }
  ].forEach(({ data, expected }) => {
    it(`should calculate score for round data where ${data.name}`, () => {
      const ruleSet = new RuleSet('test', { ...completeConfig, announcementBehaviour: AnnouncementBehaviour.FirstGetsPlusTwo });
      expect(ruleSet.calculateScore(data.builder.build())).toEqual(expected);
    });
  });
});
