export interface HistoryAction {
  forward: () => void;
  backward: () => void;
}

export const combineActions = (...actions: HistoryAction[]): HistoryAction => {
  return {
    forward: () => actions.forEach((action) => action.forward()),
    backward: () => actions.forEach((action) => action.backward()),
  };
};

class History {
  events: HistoryAction[];
  currentEventIndex: number;

  constructor() {
    this.events = [];
    this.currentEventIndex = 0;
  }

  addAction(action: HistoryAction) {
    this.events = this.events.slice(0, this.currentEventIndex);
    this.events.push(action);
    this.currentEventIndex++;
  }

  canUndo() {
    return this.currentEventIndex > 0;
  }

  canRedo() {
    return this.currentEventIndex < this.events.length;
  }

  undo() {
    if (!this.canUndo()) return;

    this.currentEventIndex--;
    this.events[this.currentEventIndex].backward();
  }

  redo() {
    if (!this.canRedo()) return;

    this.events[this.currentEventIndex].forward();
    this.currentEventIndex++;
  }

  reset() {
    this.events = [];
    this.currentEventIndex = 0;
  }
}

export const history = new History();
