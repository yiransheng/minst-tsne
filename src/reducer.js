import {
  GEN_DATA,
  TSNE_STEP,
  TSNE_STOP,
  TSNE_RUN,
  UPDATE_OPTS
} from './constants';
import {
  findIndex,
  merge
} from 'lodash';
import libtsne from './alg/tsne';

const {minst} = window;

function sampleMINST() {
  const set = mnist.set(100);
  const X = set.training.map(s => s.input);
  const Y = set.training.map(s => {
    return findIndex(s.output, x=>x===1);
  });
  return {X, Y};
}

const initState = {
  minst  : sampleMINST(),
  data2d : null,
  label  : null,
  running : false,
  step : -1,
  stepFn : ()=>{},
  tsneOpts : {
    epsilon : 10,
    perplexity : 30
  }
}

function generateData(state) {

  const {X, Y} = state.minst;
  const tsne = new libtsne.tSNE(state.tsneOpts);
  tsne.initDataRaw(X);

  const stepFn = () => {
    tsne.step();
    return tsne.getSolution();
  }

  return {
    ...state,
    data2d : stepFn(),
    label: Y,
    step : 0,
    stepFn,
    running : false
  }
}
function step(state) {
  const {stepFn} = state;
  return {...state, data2d:stepFn(), step:state.step + 1};
}

export default function reducer(state=initState, action) {
  switch (action.type) {
    case UPDATE_OPTS:
      const tsneOpts = merge({}, state.tsneOpts, action.payload);
      return {...state, data2d:null, step:-1, running:false, tsneOpts};
    case GEN_DATA:
      if (state.running) return state;
      return generateData(state);
    case TSNE_RUN:
      if (!state.data2d) return state;
      return {...state, running:true};
    case TSNE_STOP:
      return {...state, running:false};
    case TSNE_STEP:
      if (!state.running) return state;
      return step(state);
    default:
      return state;
  }
}
