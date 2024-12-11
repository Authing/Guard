import packages from '../../package.json'

export function getVersion() {
  return packages.version || '2.2.2'
}
