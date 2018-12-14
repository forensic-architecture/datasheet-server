import copy from '../copy/en'

export function modelLayerGeneric (parts) {
  return new Error(copy.errors.modelLayer(parts))
}

export function noFragment (parts) {
  return new Error(copy.errors.noFragment(parts))
}

export function noResource (parts) {
  return new Error(copy.errors.noResource(parts))
}

export default {
  modelLayerGeneric,
  noFragment,
  noResource
}
