import {
  Interpolant,
  KeyframeTrack,
  Quaternion,
  QuaternionKeyframeTrack,
} from "three";

// https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/GLTFLoader.js
export class GLTFCubicSplineInterpolant extends Interpolant {
  constructor(
    parameterPositions: any,
    sampleValues: any,
    sampleSize: any,
    resultBuffer: any,
  ) {
    super(parameterPositions, sampleValues, sampleSize, resultBuffer);
  }

  copySampleValue_(index: number) {
    // Copies a sample value to the result buffer. See description of glTF
    // CUBICSPLINE values layout in interpolate_() function below.

    const result = this.resultBuffer,
      values = this.sampleValues,
      valueSize = this.valueSize,
      offset = index * valueSize * 3 + valueSize;

    for (let i = 0; i !== valueSize; i++) {
      result[i] = values[offset + i];
    }

    return result;
  }

  interpolate_(i1: number, t0: number, t: number, t1: number) {
    const result = this.resultBuffer;
    const values = this.sampleValues;
    const stride = this.valueSize;

    const stride2 = stride * 2;
    const stride3 = stride * 3;

    const td = t1 - t0;

    const p = (t - t0) / td;
    const pp = p * p;
    const ppp = pp * p;

    const offset1 = i1 * stride3;
    const offset0 = offset1 - stride3;

    const s2 = -2 * ppp + 3 * pp;
    const s3 = ppp - pp;
    const s0 = 1 - s2;
    const s1 = s3 - pp + p;

    // Layout of keyframe output values for CUBICSPLINE animations:
    //   [ inTangent_1, splineVertex_1, outTangent_1, inTangent_2, splineVertex_2, ... ]
    for (let i = 0; i !== stride; i++) {
      const p0 = values[offset0 + i + stride]; // splineVertex_k
      const m0 = values[offset0 + i + stride2] * td; // outTangent_k * (t_k+1 - t_k)
      const p1 = values[offset1 + i + stride]; // splineVertex_k+1
      const m1 = values[offset1 + i] * td; // inTangent_k+1 * (t_k+1 - t_k)

      result[i] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;
    }

    return result;
  }
}

const _q = new Quaternion();

export class GLTFCubicSplineQuaternionInterpolant extends GLTFCubicSplineInterpolant {
  override interpolate_(i1: number, t0: number, t: number, t1: number) {
    const result = super.interpolate_(i1, t0, t, t1);

    _q.fromArray(result).normalize().toArray(result);

    return result;
  }
}

/**
 * Create a custom interpolant for cubic spline interpolation.
 * The built in Three.js cubic interpolant is not compatible with the glTF spec.
 */
export function setCubicSpline(object: KeyframeTrack) {
  // @ts-expect-error - monkey patching
  object.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(
    result: any,
  ) {
    // A CUBICSPLINE keyframe in glTF has three output values for each input value,
    // representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
    // must be divided by three to get the interpolant's sampleSize argument.
    const InterpolantType =
      this instanceof QuaternionKeyframeTrack
        ? GLTFCubicSplineQuaternionInterpolant
        : GLTFCubicSplineInterpolant;

    return new InterpolantType(
      this.times,
      this.values,
      this.getValueSize() / 3,
      result,
    );
  };
}
