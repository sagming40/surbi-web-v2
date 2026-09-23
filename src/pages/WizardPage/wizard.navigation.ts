import type { WizardResultNavigationState } from './wizard.types';

const wizardResultStorageKey = 'surbi:wizard-result';

/** 04에서 생성한 결과를 05 새로고침 뒤에도 한 번만 재사용할 수 있게 보관한다. */
export function saveWizardResultNavigationState(state: WizardResultNavigationState) {
  sessionStorage.setItem(wizardResultStorageKey, JSON.stringify(state));
}

/** 라우트 상태가 사라진 경우에만 같은 브라우저 탭의 마지막 분석 결과를 읽는다. */
export function getWizardResultNavigationState(): WizardResultNavigationState | null {
  const storedState = sessionStorage.getItem(wizardResultStorageKey);
  if (!storedState) return null;

  try {
    return JSON.parse(storedState) as WizardResultNavigationState;
  } catch {
    sessionStorage.removeItem(wizardResultStorageKey);
    return null;
  }
}

/** 새 계산을 시작할 때 이전 결과가 다시 표시되지 않도록 제거한다. */
export function clearWizardResultNavigationState() {
  sessionStorage.removeItem(wizardResultStorageKey);
}
