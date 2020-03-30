interface IAddEscapeHatch {
  element: Element;
  exceptionByElement?: Element;
  onExit?: () => void;
  onRemove?: Function;
  onStart?: (e: IEvent) => boolean;
  allowToggle?: boolean;
  isKeyDown?: boolean;
}

interface IEvent {
  event: MouseEvent | TouchEvent | KeyboardEvent;
  element: Element | null;
  prevElement: Element;
  keepElementRef: () => void;
  removeAll: () => void;
}
interface IRef {
  stopPropagation?: boolean;
  nodes: {
    removeOnClick: (e: TouchEvent | MouseEvent) => void;
    removeOnEscapeKey: (e: KeyboardEvent) => void;
    removeOnKeyUp: (e: KeyboardEvent) => void;
    onExitWithTearDown: () => void;
    onExit?: () => void;
    element: Element;
  }[];
  currentIdx: number;
}

let ref = <IRef>{
  nodes: [],
  currentIdx: 0
};

const customEvent = <IEvent>{
  removeAll: () => {
    for (let i = ref.nodes.length - 1; i >= 0; i--) {
      ref.nodes[i].onExitWithTearDown();
    }
  }
};

const stopPropagation = () => {
  if (ref.stopPropagation) {
    ref.stopPropagation = false;
    return true;
  }

  return false;
};

const getCurrentNode = () => {
  const idx = ref.nodes.length - 1;
  if (!ref.nodes.length) return null;
  return ref.nodes[idx].element;
};
const onExitWithTearDown = () => {
  const idx = ref.nodes.length - 1;
  if (!ref.nodes.length) return null;
  const { onExit } = ref.nodes[idx];
  if (onExit) onExit();
  removeLastListeners();
  ref.nodes.pop();
};
const removeLastListeners = () => {
  const { removeOnClick, removeOnEscapeKey, removeOnKeyUp } = ref.nodes[
    ref.nodes.length - 1
  ];
  document.removeEventListener("click", removeOnClick, true);
  document.removeEventListener("touchend", removeOnClick, true);
  document.removeEventListener("keydown", removeOnEscapeKey, true);
  document.removeEventListener("keyup", removeOnKeyUp, true);
};
const addListeners = () => {
  for (let i = ref.nodes.length - 1; i >= 0; i--) {
    const { removeOnClick, removeOnEscapeKey, removeOnKeyUp } = ref.nodes[i];
    document.addEventListener("click", removeOnClick, true);
    // if click is used, skip touchend

    document.addEventListener("touchend", removeOnClick, true);
    document.addEventListener("keydown", removeOnEscapeKey, true);
    document.addEventListener("keyup", removeOnKeyUp, true);
  }
};
const removeAllListeners = () => {
  ref.nodes.forEach(({ removeOnClick, removeOnEscapeKey, removeOnKeyUp }) => {
    document.removeEventListener("click", removeOnClick!, true);
    document.removeEventListener("touchend", removeOnClick!, true);
    document.removeEventListener("keydown", removeOnEscapeKey!, true);
    document.removeEventListener("keyup", removeOnKeyUp!, true);
  });
};

const isChild = (element: Element) => {
  if (!ref.nodes.length) return false;

  const parent = ref.nodes[ref.nodes.length - 1].element;

  return parent?.contains(element);
};
const eventsExist = () => {
  if (!ref.nodes.length) return false;
  return (
    ref.nodes[ref.nodes.length - 1].removeOnClick ||
    ref.nodes[ref.nodes.length - 1].removeOnEscapeKey
  );
};

export default function addEscapeHatch({
  element,
  onExit,
  onStart,
  onRemove,
  allowToggle = true
}: IAddEscapeHatch) {
  // const elementIsDifferent = ref.element ? ref.element !== element : false;
  // is child?
  // debugger;
  if (isChild(element)) {
    if (eventsExist()) {
      removeLastListeners();
      ref.nodes.pop();

      console.log("event already exist");
      return null;
    }
  }

  const removeOnClick = (e: TouchEvent | MouseEvent) => {
    // e.target = element

    const clickedTarget = e.target as HTMLElement;
    customEvent.event = e;
    customEvent.element = getCurrentNode();
    if (onStart && !onStart(customEvent)) {
      // ref.currentIdx -= 1;
      return null;
    }
    if (element.contains(clickedTarget)) {
      console.log("same");
      return null;
    }
    console.log("remove listeners");

    onExitWithTearDown();
  };
  const removeOnEscapeKey = (e: KeyboardEvent) => {
    customEvent.event = e;
    const clickedTarget = e.target as HTMLElement;
    console.log("keydown");
    console.log(e.target);

    if (e.key.match(/escape/i)) {
      onExitWithTearDown();
    }

    if (!e.key.match(/enter/i)) return null;

    if (element.contains(clickedTarget)) {
      return null;
    }

    if (onStart && !onStart(customEvent)) return null;
    onExitWithTearDown();
  };
  const removeOnKeyUp = (e: KeyboardEvent) => {
    customEvent.event = e;
    if (stopPropagation()) return null;
    const clickedTarget = e.target as HTMLElement;

    console.log("keyup");
    if (!e.key.match(/tab/i)) return null;
    if (element.contains(clickedTarget)) {
      return null;
    }
    console.log("tabbing");
    if (onStart && !onStart(customEvent)) return null;

    onExitWithTearDown();
    ref.stopPropagation = false;
  };
  console.log("added");
  // ref.element = element;
  ref.nodes.push({
    element,
    removeOnClick,
    removeOnEscapeKey,
    removeOnKeyUp,
    onExit,
    onExitWithTearDown
  });
  // event.stopPropagation doesn't stop created keyup listener from fireing
  ref.stopPropagation = true;

  removeAllListeners();
  // adds them in reverse order
  addListeners();

  return {
    remove() {
      if (onRemove) onRemove();

      removeLastListeners();
      ref.nodes.pop();
    }
  };
}
