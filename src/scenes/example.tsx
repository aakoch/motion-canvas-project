import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Node, Circle, Grid, Line, Txt, Layout, Rect } from '@motion-canvas/2d/lib/components';
import { all, chain, delay, loop, sequence, waitFor } from '@motion-canvas/core/lib/flow';
import { Direction, Vector2 } from '@motion-canvas/core/lib/types';
import { createRef, makeRef } from '@motion-canvas/core/lib/utils';
import { createSignal } from '@motion-canvas/core/lib/signals';
import {
  CodeBlock,
  edit,
  insert,
  lines,
  word,
} from '@motion-canvas/2d/lib/components/CodeBlock';
import { BounceSpring, createEaseInElastic, createEaseInOutBack, createEaseOutBack, createEaseOutBounce, createEaseOutElastic, easeInOutCubic, easeOutBack, easeOutBounce, easeOutCubic, easeOutElastic, JumpSpring, makeSpring, PlopSpring, SmoothSpring, spring, tween } from '@motion-canvas/core/lib/tweening';

const RED = '#ff6470';
const GREEN = '#99C47A';
const BLUE = '#68ABDF';
const FOREGROUND = '#f0f0f0';


const textStyle = {
  fontWeight: 700,
  fontFamily: 'JetBrains Mono',
  fontSize: 32,
  offsetY: -1,
  padding: 10,
  cache: true,
  fill: FOREGROUND
};


export default makeScene2D(function* (view) {
  const screenWidth = view.width();
  const screenHeight = view.height();;
  const group1 = createRef<Rect>();
  const scale = createSignal(1);
  const opacity = createSignal(0);
  const recordOpacity = createSignal(0);
  const line1 = createRef<Line>();
  const timeTxt = createRef<Txt>();
  const recordCircle = createRef<Circle>()

  view.add(
    <Rect ref={group1}
      layout
      x={() => {
        console.debug("view.width=",);
        return -screenWidth / 2 + 500
      }}
      direction={'row'}
      width="95%"
      stroke={BLUE}
      lineWidth={0}
      alignItems={'center'}
    >
      <Txt
        {...textStyle}
      >Incoming Feed</Txt>
      <Line
        ref={line1}
        stroke={FOREGROUND}
        lineWidth={5}
        lineHeight={50}
        endArrow
        arrowSize={10}
        points={[Vector2.zero, () => Vector2.right.scale(70 * scale())]}
      />
      <Txt
        ref={timeTxt}
        {...textStyle}
        opacity={opacity}
      >Time</Txt>
    </Rect>,
  );

  yield* group1().position.x(0, 2);
  yield* all(scale(20, 1.5), opacity(1, 1.5));

  yield* waitFor(.5);

  const group2 = createRef<Layout>();
  const recordYSignal = createSignal(0);

  view.add(
    <Layout direction={'column'}
      ref={group2}
      position={() => [0, -screenHeight]}
      layout
      justifyContent={'start'}
      alignItems={'center'}
      gap={20}
      opacity={recordOpacity}
    >
      <Circle
        ref={recordCircle}
        scale={.7}
        width={100}
        height={100}
        fill={RED}
      />
      <Txt
        x={-150}
        y={-30}
        {...textStyle}
        fill={RED}
      >Incoming Record</Txt>
    </Layout>);

  yield* waitFor(1);
  yield* all(recordOpacity(1, .2), group2().position.y(0 + 36, 1, createEaseOutBack(1)));

  yield* recordCircle().ripple(1);

  const outerLayout = createRef<Rect>();
  const windowLayout = createRef<Layout>();
  const windowRect = createRef<Rect>();
  const windowRectSignal = createSignal(0);
  const radiusLabel = createRef<Txt>();

  view.add(
    <Rect
      ref={outerLayout}
      opacity={0}>
      <Txt
        x={() => -windowRectSignal() / 2}
        y={-150}

        {...textStyle}
        fill={BLUE}
      >Dupe Check Window</Txt>
      <Layout layout
        ref={windowLayout}
      >
        <Rect
          ref={windowRect}
          height={100}
          // width="100%"
          width={() => windowRectSignal()}
          stroke={BLUE}
          lineWidth={8}
          lineJoin="round"
          x={() => -windowRectSignal()}

        >
        </Rect>,
      </Layout>
      <Txt
        ref={radiusLabel}
        x={() => -windowRectSignal() / 2}
        y={-108}
        opacity={0}
        {...textStyle}
      >Defined as a length of time</Txt>
    </Rect>
  );

  windowLayout().position.x(() => -windowRectSignal() / 2);

  yield* chain(
    waitFor(1),
    sequence(.2, outerLayout().opacity(1, 1.5),
      windowRect().ripple(1),),
    waitFor(.5),
    radiusLabel().opacity(1, .8),
    waitFor(1),
    radiusLabel().opacity(0, 1),
    radiusLabel().text(() => `Defined time: ${(windowRectSignal() / 10).toFixed(0)}`, 0.3),
    radiusLabel().opacity(1, 1),
    waitFor(1),
    windowRectSignal(400, 2, easeInOutCubic),
    waitFor(.3),
    windowRectSignal(600, 1.5, easeInOutCubic),
    waitFor(.3),
    windowRectSignal(500, 1, easeInOutCubic),
    waitFor(1),
  );

  const globalCheck = createRef<Txt>();
  view.add(
    <Txt
      ref={globalCheck}
      x={-50}
      y={-300}
      scale={2}
      opacity={0}

      {...textStyle}
    >Global check</Txt>);

  yield* chain(
    all(radiusLabel().opacity(0, 1), radiusLabel().position([radiusLabel().position.x(), 100], 1)),
    globalCheck().opacity(1, .5),
    waitFor(.4),
    all(
      globalCheck().scale(2.5, .5, easeOutCubic),
      globalCheck().opacity(.3, .5)),
    all(
      globalCheck().scale(2, .5, easeOutBounce),
      globalCheck().opacity(1, .5)));

  const distanceSignal = createSignal(24);

  for (let index = 1; index <= 12; index++) {
    const { rand2: rand1, scale1: scale1, innerRect: innerRect1 } = createThing(index, 1);
    const { rand2: rand2, scale1: scale2, innerRect: innerRect2 } = createThing(index, -1);
  }


  const match = createRef<Circle>();
  view.add(
    <Circle
      ref={match}
      scale={.7}
      width={20}
      height={20}
      fill={RED}
      x={-150}
      y={() => distanceSignal() * distanceSignal() + 10} />);

  yield* chain(
    distanceSignal(2, 2),
    waitFor(.5),
    loop(3, () => match().ripple(1)),
    waitFor(5));

  function createThing(index: number, sign: number) {
    const clone1 = group1().clone();
    const innerRect = createRef<Rect>();
    const randIndex = Math.round(Math.random());
    console.debug("randIndex=", randIndex);
    const color = [GREEN, BLUE][randIndex];
    view.add(
      <Rect
        ref={innerRect}
      >
        <Circle
          scale={.6}
          width={20}
          height={20}
          fill={color}
          x={-600 * Math.random() - 15} />
        <Circle
          scale={.7}
          width={20}
          height={20}
          fill={color}
          opacity={.9}
          x={-500 * Math.random() - 15} />
      </Rect>);
    clone1.opacity(() => distanceSignal() / 20 + .1);
    const rand2 = Math.random();
    const rand = (rand2 / 2) + .1;
    const scale1 = 1; // + rand / 2;
    clone1.scale(scale1);
    innerRect().position(() => [0, sign * index * distanceSignal() * distanceSignal()]);
    innerRect().add(clone1);
    return { rand2, scale1, innerRect };
  }
});
