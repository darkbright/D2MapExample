/**
 * * 군대부호 속성 정보 팝업 - appendChild 메서드에 노드 추가
 * * SIDCSelector 사용 용도 - sidc selector에서 사용되는 군대부호 트리 
 */

$(function () {
  //console.log("All resources finished loading!");
  const bodyElement = document.querySelector('body');
  // 군대부호 속성 정보 팝업 - 기본군대부호
  const divContainer = document.createElement('div');
  divContainer.setAttribute('id', 'd2map_ms_prop_container');
  divContainer.setAttribute('class', 'd2map_ms_prop_container d2map_ui-popup');
  // 군대부호 속성 정보 팝업 - 기본군대부호 AH~AJ 팝업창
  const divPopUp = document.createElement('div');
  divPopUp.setAttribute('id', 'd2map_ms_prop_modal');
  // 군대부호 속성 정보 팝업 - 작전활동부호 선형/면형
  const divContainerNonPoint = document.createElement('div');
  divContainerNonPoint.setAttribute('id', 'd2map_ms_prop_container_nonpoint');
  divContainerNonPoint.setAttribute('class', 'd2map_ms_prop_container d2map_ui-popup');
  // 군대부호 속성 정보 팝업 - 작전활동부호 sidc selector
  const divContainerSIDC = document.createElement('div');
  divContainerSIDC.setAttribute('id', 'd2map_ms_prop_container_sidc');
  divContainerSIDC.setAttribute('class', 'd2map_ui-popup d2map_ms_prop_container');
  // 군대부호 속성 정보 팝업 - 작전활동부호 점형
  const divContainerEx = document.createElement('div');
  divContainerEx.setAttribute('id', 'd2map_ms_prop_container_ex');
  divContainerEx.setAttribute('class', 'd2map_ms_prop_container');

  // 가상돔 객체로 변환해주는 함수
  function h(type, props, ...children) {
    return { type, props, children }
  }

  function createElement(node) {
    if (typeof node === 'string') {
      // text node를 만들어서 반환한다.
      return document.createTextNode(node);
    }

    // tag에 대한 element를 만든다.
    const $el = document.createElement(node.type);

    // 정의한 속성을 삽입한다.
    Object.entries(node.props || {})
      .filter(([attr, value]) => value)
      .forEach(([attr, value]) => (
        $el.setAttribute(attr, value)
      ));

    // node의 children virtual dom을 dom으로 변환한다.
    // $el에 변환된 children dom을 추가한다.
    try {
      node.children
        .map(createElement)
        .forEach(child => $el.appendChild(child));
    } catch (e) {
      console.log(node);
      console.error(e);
    }

    // 변환된 dom을 반환한다.
    return $el;
  }
  //TODO data-lang 추가하기
  const header = (
    h('div', { class: 'd2map_header' },
      h('div', { class: 'd2map_title', 'data-lang': 'title' }),
      h('a', { href: '#', class: "d2map_popup-close-btn" })
    )
  );

  const leftSection = (
    h('div', { class: 'd2map_content_left_section' },
      h('div', { class: 'd2map_sidc_div' },
        h('span', { class: 'd2map_sidc_span', id: 'd2map_ms-prop-edit-sidc' }, 'XXXXXYYYYYZZZZZ')
      ),
      h('div', { class: 'd2map_img_container', id: 'd2map_ms-prop-edit-img-container' })
    )
  );

  const rightSection = (
    h('div', { class: 'd2map_content_right_section' },
      h('div', { class: 'd2map_tab-container' },
        h('ul', { class: 'd2map_tab-controller' },
          h('li', { class: 'd2map_selected', id: 'd2map_basic-tab', 'data-tab': 'basic-content', 'data-lang': 'basic' }),
          h('li', { id: 'd2map_extension-tab', 'data-tab': 'extension-content', 'data-lang': 'extension' })
        ),
        h('div', { class: 'd2map_tab-content' },
          h('div', { class: 'd2map_basic-content' },
            h('table', { id: 'd2map_basic-content-table' },
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-select-affiliation', 'data-lang': 'affiliation' })
                ),
                h('td', null,
                  h('select', { class: 'd2map_fixed-width-small', id: 'd2map_ms-prop-edit-select-affiliation', name: 'ms-prop-edit-select' },
                    h('option', { value: 'P', 'data-lang': 'aff_p' }),
                    h('option', { value: 'U', 'data-lang': 'aff_u' }),
                    h('option', { value: 'F', selected: 'selected', 'data-lang': 'aff_f' }),
                    h('option', { value: 'N', 'data-lang': 'aff_n' }),
                    h('option', { value: 'H', 'data-lang': 'aff_h' }),
                    h('option', { value: 'A', 'data-lang': 'aff_a' }),
                    h('option', { value: 'S', 'data-lang': 'aff_s' }),
                    h('option', { value: 'G', 'data-lang': 'aff_g' }),
                    h('option', { value: 'W', 'data-lang': 'aff_w' }),
                    h('option', { value: 'D', 'data-lang': 'aff_d' }),
                    h('option', { value: 'L', 'data-lang': 'aff_l' }),
                    h('option', { value: 'M', 'data-lang': 'aff_m' }),
                    h('option', { value: 'J', 'data-lang': 'aff_j' }),
                    h('option', { value: 'K', 'data-lang': 'aff_k' })
                  )
                )
              ),

              h('tr', { class: 'd2map_status' }, //기본군대부호, 신호정보부호, 안정화작전에 적용
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-select-status', 'data-lang': 'status' })
                ),
                h('td', null,
                  h('select', { class: 'd2map_fixed-width-more-small', id: 'd2map_ms-prop-edit-select-status', name: 'ms-prop-edit-select' },
                    h('option', { value: '-' }, '-'),
                    h('option', { value: 'A', 'data-lang': 'status_a' }),
                    h('option', { value: 'P', 'data-lang': 'status_p' }),
                    h('option', { value: 'C', 'data-lang': 'status_c' }),
                    h('option', { value: 'D', 'data-lang': 'status_d' }),
                    h('option', { value: 'X', 'data-lang': 'status_x' }),
                    h('option', { value: 'F', 'data-lang': 'status_f' })
                  )
                )
              ),

              h('tr', { class: 'd2map_status_emergency' }, //비상관리부호에 적용
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-select-status_emergency', 'data-lang': 'status' })
                ),
                h('td', null,
                  h('select', { class: 'd2map_fixed-width-more-small', id: 'd2map_ms-prop-edit-select-status_emergency', name: 'ms-prop-edit-select' },
                    h('option', { value: '-' }, '-'),
                    h('option', { value: 'A', 'data-lang': 'status_a' }),
                    h('option', { value: 'P', 'data-lang': 'status_p' })
                  )
                )
              ),

              h('tr', { class: 'd2map_icon' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-chk-displayicon', 'data-lang': 'displayicon' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', id: 'd2map_ms-prop-edit-chk-displayicon', name: 'ms-prop-edit-chk', checked: 'checked' })
                )
              ),
              h('tr', { class: 'd2map_frame' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-chk-displayframe', 'data-lang': 'displayframe' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', id: 'd2map_ms-prop-edit-chk-displayframe', name: 'ms-prop-edit-chk', checked: 'checked' })
                )
              ),
              h('tr', { class: 'd2map_fill' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-chk-displayfill', 'data-lang': 'displayfill' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', id: 'd2map_ms-prop-edit-chk-displayfill', name: 'ms-prop-edit-chk', checked: 'checked' })
                )
              ),
              h('tr', { class: 'd2map_civilianColor' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-chk-civilianColor', 'data-lang': 'civilianColor' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', id: 'd2map_ms-prop-edit-chk-civilianColor', name: 'ms-prop-edit-chk' })
                )
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-size', 'data-lang': 'size' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '3', max: '14', id: 'd2map_ms-prop-edit-text-size', name: 'ms-prop-edit-text', value: '7' }),
                )
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-opacity', 'data-lang': 'opacity' })
                ),
                h('td', null,
                  h('input', { type: 'number', id: 'd2map_ms-prop-edit-text-opacity', name: 'ms-prop-edit-text' })
                )
              ),
              h('tr', null,
                h('td', null,
                  h('label', { 'data-lang': 'userDefineFillColor' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', id: 'd2map_ms-prop-edit-chk-userDefineFillColor', name: 'ms-prop-edit-chk' }),
                  h('input', { type: 'color', id: 'd2map_ms-prop-edit-color-userDefineFillColor', name: 'ms-prop-edit-text', value: '#7fdefd' }),
                )
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-strokeWidth', 'data-lang': 'strokeWidth' })
                ),
                h('td', null,
                  h('select', { id: 'd2map_ms-prop-edit-text-strokeWidth', name: 'ms-prop-edit-select' },
                    h('option', { value: '2', 'data-lang': 'strokeWidth_thin' }),
                    h('option', { value: '4', 'data-lang': 'strokeWidth_medium', selected: true }),
                    h('option', { value: '6', 'data-lang': 'strokeWidth_thick' })
                  )
                )
              ),
              h('tr', { class: 'd2map_operationalConditionPoint' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-select-operationalConditionPoint', 'data-lang': 'operationalConditionPoint' })
                ),
                h('td', null,
                  h('select', { id: 'd2map_ms-prop-edit-select-operationalConditionPoint', name: 'ms-prop-edit-select' },
                    h('option', { value: '0', 'data-lang': 'notshown' }),
                    h('option', { value: '1', 'data-lang': 'mid' }),
                    h('option', { value: '2', 'data-lang': 'bottom' })
                  )
                )
              ),
              h('tr', { class: 'd2map_combatEffectiveness' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-combatEffectiveness', 'data-lang': 'combatEffectiveness' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-combatEffectiveness', name: 'ms-prop-edit-text', placeholder: '0 ~ 100' }),
                  h('input', { type: 'checkbox', id: 'd2map_ms-prop-edit-chk-showCombatEffectivenessLabel', name: 'ms-prop-edit-chk' }),
                  h('label', { for: 'd2map_ms-prop-edit-chk-showCombatEffectivenessLabel', 'data-lang': 'combatshow' })
                )
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-chk-showCombatEffectivenessWaterFill', 'data-lang': 'waterfill' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', id: 'd2map_ms-prop-edit-chk-showCombatEffectivenessWaterFill', name: 'ms-prop-edit-chk' })
                )
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-chk-showUseDefineColor', 'data-lang': 'fillsettings' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', id: 'd2map_ms-prop-edit-chk-showUseDefineColor', name: 'ms-prop-edit-chk' })
                )
              ),
              h('tr', { class: 'd2map_useDefineColorTocombatEffectiveness' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-color-useDefineColorTocombatEffectiveness', 'data-lang': 'fillcolors' })
                ),
                h('td', null,
                  h('input', { type: 'color', id: 'd2map_ms-prop-edit-color-useDefineColorTocombatEffectiveness', name: 'ms-prop-edit-text' })
                )
              ),
            )
          ),
          h('div', { class: 'd2map_extension-content' },
            h('table', { id: 'd2map_extension-content-table' },
              h('tr', { class: 'd2map_echelon' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-select-echelon', 'data-lang': 'echelon' })
                ),
                h('td', null,
                  h('select', { id: 'd2map_ms-prop-edit-select-echelon', name: 'ms-prop-edit-select' },
                    h('option', { value: '-' }, 'None'),
                    h('option', { value: 'A', 'data-lang': 'echelon_a' }),
                    h('option', { value: 'B', 'data-lang': 'echelon_b' }),
                    h('option', { value: 'C', 'data-lang': 'echelon_c' }),
                    h('option', { value: 'D', 'data-lang': 'echelon_d' }),
                    h('option', { value: 'E', 'data-lang': 'echelon_e' }),
                    h('option', { value: 'F', 'data-lang': 'echelon_f' }),
                    h('option', { value: 'G', 'data-lang': 'echelon_g' }),
                    h('option', { value: 'H', 'data-lang': 'echelon_h' }),
                    h('option', { value: 'I', 'data-lang': 'echelon_i' }),
                    h('option', { value: 'J', 'data-lang': 'echelon_j' }),
                    h('option', { value: 'K', 'data-lang': 'echelon_k' }),
                    h('option', { value: 'L', 'data-lang': 'echelon_l' }),
                    h('option', { value: 'M', 'data-lang': 'echelon_m' }),
                    h('option', { value: 'P', 'data-lang': 'echelon_p' }),
                    h('option', { value: 'Q', 'data-lang': 'echelon_q' }),
                    h('option', { value: 'R', 'data-lang': 'echelon_r' }),
                    h('option', { value: 'S', 'data-lang': 'echelon_s' }),
                    h('option', { value: 'T', 'data-lang': 'echelon_t' }),
                    h('option', { value: 'U', 'data-lang': 'echelon_u' }),
                    h('option', { value: 'V', 'data-lang': 'echelon_v' }),
                    h('option', { value: 'W', 'data-lang': 'echelon_w' }),
                    h('option', { value: 'X', 'data-lang': 'echelon_x' }),
                    h('option', { value: 'Y', 'data-lang': 'echelon_y' }),
                    h('option', { value: 'N', 'data-lang': 'echelon_n' }),
                  )
                )
              ),
              h('tr', { class: 'd2map_quantity' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-quantity', 'data-lang': 'quantity' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-quantity', name: 'ms-prop-edit-text', maxlength: '9', 'data-placeholder': 'quantityPlaceholder' })
                )
              ),
              h('tr', { class: 'd2map_mobileUnit' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-mobileUnit', 'data-lang': 'mobileUnit' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', id: 'd2map_ms-prop-edit-text-mobileUnit', name: 'ms-prop-edit-text' })
                )
              ),
              h('tr', { class: 'd2map_reinforcedReduced' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-reinforcedReduced', 'data-lang': 'reinforcedReduced' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-reinforcedReduced', name: 'ms-prop-edit-text', maxlength: '3', 'data-placeholder': 'reinforcedReducedPlaceholder' })
                )
              ),
              h('tr', { class: 'd2map_staffComments' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-staffComments', 'data-lang': 'staffComments' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-staffComments', name: 'ms-prop-edit-text', maxlength: '20', 'data-placeholder': 'staffCommentsPlaceholder' })
                )
              ),
              h('tr', { class: 'd2map_additionalInformation' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-additionalInformation', 'data-lang': 'activity' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-additionalInformation', name: 'ms-prop-edit-text', maxlength: '20', 'data-placeholder': 'activityPlaceholder' })
                )
              ),
              h('tr', { class: 'd2map_evaluationRating' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-select-evaluationRating', 'data-lang': 'rating' })
                ),
                h('td', null,
                  h('select', { class: 'd2map_fixed-width', id: 'd2map_ms-prop-edit-select-evaluationRating', name: 'ms-prop-edit-select' },
                    h('option', { value: '-' }, 'None'),
                    h('option', { value: 'A1', 'data-lang': 'rating_a1' }),
                    h('option', { value: 'A2', 'data-lang': 'rating_a2' }),
                    h('option', { value: 'A3', 'data-lang': 'rating_a3' }),
                    h('option', { value: 'A4', 'data-lang': 'rating_a4' }),
                    h('option', { value: 'A5', 'data-lang': 'rating_a5' }),
                    h('option', { value: 'A6', 'data-lang': 'rating_a6' }),
                    h('option', { value: 'B1', 'data-lang': 'rating_b1' }),
                    h('option', { value: 'B2', 'data-lang': 'rating_b2' }),
                    h('option', { value: 'B3', 'data-lang': 'rating_b3' }),
                    h('option', { value: 'B4', 'data-lang': 'rating_b4' }),
                    h('option', { value: 'B5', 'data-lang': 'rating_b5' }),
                    h('option', { value: 'B6', 'data-lang': 'rating_b6' }),
                    h('option', { value: 'C1', 'data-lang': 'rating_c1' }),
                    h('option', { value: 'C2', 'data-lang': 'rating_c2' }),
                    h('option', { value: 'C3', 'data-lang': 'rating_c3' }),
                    h('option', { value: 'C4', 'data-lang': 'rating_c4' }),
                    h('option', { value: 'C5', 'data-lang': 'rating_c5' }),
                    h('option', { value: 'C6', 'data-lang': 'rating_c6' }),
                    h('option', { value: 'D1', 'data-lang': 'rating_d1' }),
                    h('option', { value: 'D2', 'data-lang': 'rating_d2' }),
                    h('option', { value: 'D3', 'data-lang': 'rating_d3' }),
                    h('option', { value: 'D4', 'data-lang': 'rating_d4' }),
                    h('option', { value: 'D5', 'data-lang': 'rating_d5' }),
                    h('option', { value: 'D6', 'data-lang': 'rating_d6' }),
                    h('option', { value: 'E1', 'data-lang': 'rating_e1' }),
                    h('option', { value: 'E2', 'data-lang': 'rating_e2' }),
                    h('option', { value: 'E3', 'data-lang': 'rating_e3' }),
                    h('option', { value: 'E4', 'data-lang': 'rating_e4' }),
                    h('option', { value: 'E5', 'data-lang': 'rating_e5' }),
                    h('option', { value: 'E6', 'data-lang': 'rating_e6' }),
                    h('option', { value: 'F1', 'data-lang': 'rating_f1' }),
                    h('option', { value: 'F2', 'data-lang': 'rating_f2' }),
                    h('option', { value: 'F3', 'data-lang': 'rating_f3' }),
                    h('option', { value: 'F4', 'data-lang': 'rating_f4' }),
                    h('option', { value: 'F5', 'data-lang': 'rating_f5' }),
                    h('option', { value: 'F6', 'data-lang': 'rating_f6' })
                  )
                )
              ),
              h('tr', { class: 'd2map_signatureEquipment' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-signatureEquipment', 'data-lang': 'signatureEquipment' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-signatureEquipment', name: 'ms-prop-edit-text', maxlength: '1', 'data-placeholder': 'signatureEquipmentPlaceholder' })
                )
              ),
              h('tr', { class: 'd2map_higherFormation' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-higherFormation', 'data-lang': 'higherFormation' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-higherFormation', name: 'ms-prop-edit-text', maxlength: '21', 'data-placeholder': 'higherFormationPlaceholder' }),
                )
              ),
              h('tr', { class: 'd2map_hostile' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-hostile', 'data-lang': 'hostile' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-hostile', name: 'ms-prop-edit-text', maxlength: '3', 'data-placeholder': 'hostilePlaceholder' }),
                )
              ),
              h('tr', { class: 'd2map_iffSif' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-iffSif', 'data-lang': 'iffSif' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-iffSif', name: 'ms-prop-edit-text', maxlength: '5', 'data-placeholder': 'iffSifPlaceholder' }),
                )
              ),
              h('tr', { class: 'd2map_direction' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-direction', 'data-lang': 'direction' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-direction', name: 'ms-prop-edit-text', placeholder: '0 ~ 360' }),
                )
              ),
              h('tr', { class: 'd2map_mobilityIndicator' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-select-mobilityIndicator', 'data-lang': 'mobility' })
                ),
                h('td', null,
                  h('select', { id: 'd2map_ms-prop-edit-select-mobilityIndicator', name: 'ms-prop-edit-select' },
                    h('option', { value: '-' }, 'None'),
                    h('option', { value: 'O', 'data-lang': 'mobility_o' }),
                    h('option', { value: 'P', 'data-lang': 'mobility_p' }),
                    h('option', { value: 'Q', 'data-lang': 'mobility_q' }),
                    h('option', { value: 'R', 'data-lang': 'mobility_r' }),
                    h('option', { value: 'S', 'data-lang': 'mobility_s' }),
                    h('option', { value: 'T', 'data-lang': 'mobility_t' }),
                    h('option', { value: 'U', 'data-lang': 'mobility_u' }),
                    h('option', { value: 'V', 'data-lang': 'mobility_v' }),
                    h('option', { value: 'W', 'data-lang': 'mobility_w' }),
                    h('option', { value: 'X', 'data-lang': 'mobility_x' }),
                    h('option', { value: 'Y', 'data-lang': 'mobility_y' })
                  )
                )
              ),
              h('tr', { class: 'd2map_mobilityCode' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-select-mobilityCode', 'data-lang': 'mobilityCode' })
                ),
                h('td', null,
                  h('select', { id: 'd2map_ms-prop-edit-select-mobilityCode', name: 'ms-prop-edit-select' },
                    h('option', { value: '-' }, 'None'),
                    h('option', { value: 'M', 'data-lang': 'mobilityCode_m' }),
                    h('option', { value: 'S', 'data-lang': 'mobilityCode_s' }),
                    h('option', { value: 'U', 'data-lang': 'mobilityCode_u' })
                  )
                )
              ),
              h('tr', { class: 'd2map_headquarters' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-headquarters', 'data-lang': 'headquarters' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', id: 'd2map_ms-prop-edit-text-headquarters', name: 'ms-prop-edit-text' }),
                )
              ),
              h('tr', { class: 'd2map_uniqueDesignation' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-uniqueDesignation', 'data-lang': 'uniqueDesignation' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-uniqueDesignation', name: 'ms-prop-edit-text', maxlength: '15', 'data-placeholder': 'uniqueDesignationPlaceholder' }),
                )
              ),
              h('tr', { class: 'd2map_type' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-type', 'data-lang': 'type' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-type', name: 'ms-prop-edit-text', maxlength: '24', 'data-placeholder': 'typePlaceholder' }),
                )
              ),
              h('tr', { class: 'd2map_dtg' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-dtg', 'data-lang': 'dtg' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-dtg', name: 'ms-prop-edit-text', maxlength: '16', 'data-placeholder': 'dtgPlaceholder' }),
                )
              ),
              h('tr', { class: 'd2map_altitudeDepth' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-altitudeDepth', 'data-lang': 'altitudeDepth' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-altitudeDepth', name: 'ms-prop-edit-text', maxlength: '14', 'data-placeholder': 'altitudeDepthPlaceholder' }),
                )
              ),
              h('tr', { class: 'd2map_location' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-location', 'data-lang': 'location' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-location', name: 'ms-prop-edit-text', maxlength: '19', 'data-placeholder': 'locationPlaceholder' }),
                )
              ),
              h('tr', { class: 'd2map_speed' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-speed', 'data-lang': 'speed' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-speed', name: 'ms-prop-edit-text', maxlength: '8', 'data-placeholder': 'speedPlaceholder' }),
                )
              ),
              h('tr', { class: 'd2map_specialHeadquarters' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-specialHeadquarters', 'data-lang': 'specialHeadquarters' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-specialHeadquarters', name: 'ms-prop-edit-text', maxlength: '9', placeholder: '9' }),
                )
              ),
              h('tr', { class: 'd2map_feintDummyIndicator' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-feintDummyIndicator', 'data-lang': 'feintDummyIndicator' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-feintDummyIndicator', name: 'ms-prop-edit-text', placeholder: '1' }),
                )
              ),
              h('tr', { class: 'd2map_platformType' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-select-platformType', 'data-lang': 'platformType' })
                ),
                h('td', null,
                  h('select', { id: 'd2map_ms-prop-edit-select-platformType', name: 'ms-prop-edit-select' },
                    h('option', { value: '-' }, 'None'),
                    h('option', { value: 'ELNOT', 'data-lang': 'platformType_elnot' }),
                    h('option', { value: 'CENOT', 'data-lang': 'platformType_cenot' })
                  )
                )
              ),
              h('tr', { class: 'd2map_equipmentTeardownTime' },
                h('td', null,
                  h('label', { 'data-lang': 'equipmentTeardownTime' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-equipmentTeardownTime', name: 'ms-prop-edit-text', maxlength: '3', 'data-placeholder': 'equipmentTeardownTimePlaceholder' }),
                )
              ),
              h('tr', { class: 'd2map_commonIdentifier' },
                h('td', null,
                  h('label', { 'data-lang': 'commonIdentifier' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-commonIdentifier', name: 'ms-prop-edit-text', maxlength: '12', 'data-placeholder': 'commonIdentifierPlaceholder' }),
                )
              ),
              h('tr', { class: 'd2map_auxiliaryEquipmentIndicator' },
                h('td', null,
                  h('label', { 'data-lang': 'auxiliaryEquipmentIndicator' })
                ),
                h('td', { title: 'shortSonar/longSonar' },
                  h('select', { id: 'd2map_ms-prop-edit-text-auxiliaryEquipmentIndicator', name: 'ms-prop-edit-select' },
                    h('option', { value: 'None' }, 'None'),
                    h('option', { value: 'shortSonar', 'data-lang': 'shortSonar' }),
                    h('option', { value: 'longSonar', 'data-lang': 'longSonar' })
                  ),
                )
              ),
              h('tr', { class: 'd2map_areaOfUncertainty' },
                h('td', null,
                  h('label', { 'data-lang': 'areaOfUncertainty' })
                ),
                h('td', null,
                  h('a', { type: 'button', class: 'd2map_popup-trigger', 'data-index': '0' }, '...'),
                )
              ),
              h('tr', { class: 'd2map_deadReckoningTrailer' },
                h('td', null,
                  h('label', { 'data-lang': 'deadReckoningTrailer' })
                ),
                h('td', null,
                  h('a', { type: 'button', class: 'd2map_popup-trigger', 'data-index': '1' }, '...'),
                )
              ),
              h('tr', { class: 'd2map_speedLeaderTrailer' },
                h('td', null,
                  h('label', { 'data-lang': 'speedLeaderTrailer' })
                ),
                h('td', null,
                  h('a', { type: 'button', class: 'd2map_popup-trigger', 'data-index': '2' }, '...'),
                )
              ),
              h('tr', { class: 'd2map_color-properties' },
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-color-properties', 'data-lang': 'colorsettings' })
                ),
                h('td', null,
                  h('input', { type: 'color', id: 'd2map_ms-prop-edit-color-properties', value: '#000000' }),
                )
              )
            )
          )
        )
      )
    )
  );

  const popupModal = (
    h('div', null,
      h('div', { class: 'd2map_popup-modal shadow', 'data-popup-modal': '0' },
        h('div', { class: 'd2map_modal-header' },
          h('button', { class: 'd2map_popup-modal-close' }),
          h('h4', { 'data-lang': 'areaOfUncertainty' })
        ),
        h('div', { class: 'd2map_ms-prop-edit-bottom-forAH' },
          h('nav', null,
            h('div', { class: 'd2map_AH-tab', 'data-index': '0', 'data-lang': 'ah_tab0' }),
            h('div', { class: 'd2map_AH-tab', 'data-index': '1', 'data-lang': 'ah_tab1' }),
            h('div', { class: 'd2map_AH-tab', 'data-index': '2', 'data-lang': 'ah_tab2' }),
            h('div', { class: 'd2map_AH-tab', 'data-index': '3', 'data-lang': 'ah_tab3' }),
            h('span', { class: 'd2map_AH-glider' })
          ),
          h('div', { class: 'd2map_AH-tab-content active', id: 'd2map_AH-tab-none' },
            h('div', { 'data-lang': 'ah_content' }),
            h('button', { id: 'd2map_AH-confirm-btn', 'data-lang': 'confirm' })
          ),
          h('div', { class: 'd2map_AH-tab-content', id: 'd2map_AH-tab-direction' },
            h('table', null,
              h('tr', null,
                h('th', { 'data-lang': 'displayedShape' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAHLineLength', 'data-lang': 'distance' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 300, class: 'd2map_direction', id: 'd2map_ms-prop-edit-text-infoAHLineLength', placeholder: '0' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-direction-infoAHAzimuth', 'data-lang': 'azimuth' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 360, class: 'd2map_direction', id: 'd2map_ms-prop-edit-text-direction-infoAHAzimuth', placeholder: '0' })
                ),
              ),
              h('tr', null,
                h('td', null),
                h('td', null),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAHAzimuthError', 'data-lang': 'errorangle' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 360, class: 'd2map_direction', id: 'd2map_ms-prop-edit-text-infoAHAzimuthError', placeholder: '0' })
                ),
              ),
              h('tr', null,
                h('th', { 'data-lang': 'defenseline' }, '방위선 속성')
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-direction-infoAHLineColor', 'data-lang': 'color' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', class: 'd2map_direction', id: 'd2map_ms-prop-edit-chk-direction-infoAHLineColor', checked: 'checked' }),
                  h('input', { type: 'color', class: 'd2map_direction', id: 'd2map_ms-prop-edit-text-direction-infoAHLineColor' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-direction-infoAHLineWidth', 'data-lang': 'thickness' })
                ),
                h('td', null,
                  h('input', { type: 'number', step: '0.01', min: '0', max: 5.0, class: 'd2map_direction', id: 'd2map_ms-prop-edit-text-direction-infoAHLineWidth', placeholder: '0.05' })
                ),
              ),
              h('tr', null,
                h('td', null),
                h('td', null),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-direction-infoAHLineStyle', 'data-lang': 'dottedline' })
                ),
                h('td', null,
                  h('input', { type: 'text', class: 'd2map_direction', id: 'd2map_ms-prop-edit-text-direction-infoAHLineStyle', placeholder: '' })
                ),
              ),
              h('tr', null,
                h('th', { 'data-lang': 'errorline' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAHLineColorError', 'data-lang': 'color' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', class: 'd2map_direction', id: 'd2map_ms-prop-edit-chk-infoAHLineColorError', checked: 'checked' }),
                  h('input', { type: 'color', class: 'd2map_direction', id: 'd2map_ms-prop-edit-text-infoAHLineColorError' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAHLineWidthError', 'data-lang': 'thickness' })
                ),
                h('td', null,
                  h('input', { type: 'number', step: '0.01', min: '0', max: 5.0, class: 'd2map_direction', id: 'd2map_ms-prop-edit-text-infoAHLineWidthError', placeholder: '0.05' })
                )
              ),
              h('tr', null,
                h('td', null),
                h('td', null),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAHLineStyleError', 'data-lang': 'dottedline' })
                ),
                h('td', null,
                  h('input', { type: 'text', class: 'd2map_direction', id: 'd2map_ms-prop-edit-text-infoAHLineStyleError', placeholder: '' })
                ),
              )
            )
          ),
          h('div', { class: 'd2map_AH-tab-content', id: 'd2map_AH-tab-ellipse' },
            h('table', null,
              h('tr', null,
                h('th', { 'data-lang': 'displayedShape' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-ellipse-infoAHRectWidth', 'data-lang': 'horizontal' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 200, class: 'd2map_ellipse', id: 'd2map_ms-prop-edit-text-ellipse-infoAHRectWidth', placeholder: '0' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-ellipse-infoAHAzimuth', 'data-lang': 'azimuth' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 360, class: 'd2map_ellipse', id: 'd2map_ms-prop-edit-text-ellipse-infoAHAzimuth', placeholder: '0' })
                ),
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-ellipse-infoAHRectHeight', 'data-lang': 'vertical' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 200, class: 'd2map_ellipse', id: 'd2map_ms-prop-edit-text-ellipse-infoAHRectHeight', placeholder: '0' })
                ),
              ),
              h('tr', null,
                h('th', { 'data-lang': 'ellipsoid' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-ellipse-infoAHLineColor', 'data-lang': 'color' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', class: 'd2map_ellipse', id: 'd2map_ms-prop-edit-chk-ellipse-infoAHLineColor', checked: 'checked' }),
                  h('input', { type: 'color', class: 'd2map_ellipse', id: 'd2map_ms-prop-edit-text-ellipse-infoAHLineColor' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-ellipse-infoAHLineWidth', 'data-lang': 'thickness' })
                ),
                h('td', null,
                  h('input', { type: 'number', step: '0.01', min: '0', max: 5.0, class: 'd2map_ellipse', id: 'd2map_ms-prop-edit-text-ellipse-infoAHLineWidth', placeholder: '0.05' })
                ),
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-ellipse-infoAHFillColor', 'data-lang': 'fillcolor' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', class: 'd2map_ellipse', id: 'd2map_ms-prop-edit-chk-ellipse-infoAHFillColor' }),
                  h('input', { type: 'color', class: 'd2map_ellipse', id: 'd2map_ms-prop-edit-text-ellipse-infoAHFillColor' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-ellipse-infoAHLineStyle', 'data-lang': 'dottedline' })
                ),
                h('td', null,
                  h('input', { type: 'text', class: 'd2map_ellipse', id: 'd2map_ms-prop-edit-text-ellipse-infoAHLineStyle', placeholder: '' })
                ),
              ),
            )
          ),
          h('div', { class: 'd2map_AH-tab-content', id: 'd2map_AH-tab-rectangle' },
            h('table', null,
              h('tr', null,
                h('th', { 'data-lang': 'displayedShape' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-rectangle-infoAHRectWidth', 'data-lang': 'horizontal' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 200, class: 'd2map_rectangle', id: 'd2map_ms-prop-edit-text-rectangle-infoAHRectWidth', placeholder: '0' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-rectangle-infoAHAzimuth', 'data-lang': 'azimuth' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 360, class: 'd2map_rectangle', id: 'd2map_ms-prop-edit-text-rectangle-infoAHAzimuth', placeholder: '0' })
                ),
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-rectangle-infoAHRectHeight', 'data-lang': 'vertical' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 200, class: 'd2map_rectangle', id: 'd2map_ms-prop-edit-text-rectangle-infoAHRectHeight', placeholder: '0' })
                ),
              ),
              h('tr', null,
                h('th', { 'data-lang': 'rectangle' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-rectangle-infoAHLineColor', 'data-lang': 'color' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', class: 'd2map_rectangle', id: 'd2map_ms-prop-edit-chk-rectangle-infoAHLineColor', checked: 'checked' }),
                  h('input', { type: 'color', class: 'd2map_rectangle', id: 'd2map_ms-prop-edit-text-rectangle-infoAHLineColor' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-rectangle-infoAHLineWidth', 'data-lang': 'thickness' })
                ),
                h('td', null,
                  h('input', { type: 'number', step: '0.01', min: '0', max: 5.0, class: 'd2map_rectangle', id: 'd2map_ms-prop-edit-text-rectangle-infoAHLineWidth', placeholder: '0.05' })
                ),
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-rectangle-infoAHFillColor', 'data-lang': 'fillcolor' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', class: 'd2map_rectangle', id: 'd2map_ms-prop-edit-chk-rectangle-infoAHFillColor' }),
                  h('input', { type: 'color', class: 'd2map_rectangle', id: 'd2map_ms-prop-edit-text-rectangle-infoAHFillColor' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-rectangle-infoAHLineStyle', 'data-lang': 'dottedline' })
                ),
                h('td', null,
                  h('input', { type: 'number', step: '0.01', class: 'd2map_rectangle', id: 'd2map_ms-prop-edit-text-rectangle-infoAHLineStyle', placeholder: '' })
                ),
              ),
            )
          ),
        )
      ),
      h('div', { class: 'd2map_popup-modal shadow', 'data-popup-modal': '1' },
        h('div', { class: "d2map_modal-header" },
          h('button', { class: 'd2map_popup-modal-close' }),
          h('h4', { 'data-lang': 'deadReckoningTrailer' })
        ),
        h('div', { class: 'd2map_ms-prop-edit-bottom-forAI' },
          h('nav', null,
            h('div', { class: 'd2map_AI-tab', 'data-index': '0', 'data-lang': 'ai_tab0' }),
            h('div', { class: 'd2map_AI-tab', 'data-index': '1', 'data-lang': 'ai_tab1' }),
            h('div', { class: 'd2map_AI-tab', 'data-index': '2', 'data-lang': 'ai_tab2' }),
            h('span', { class: 'd2map_AI-glider' })
          ),
          h('div', { class: 'd2map_AI-tab-content active', id: 'd2map_AI-tab-none' },
            h('div', { 'data-lang': 'ai_content' }),
            h('button', { id: 'd2map_AI-confirm-btn', 'data-lang': 'confirm' })
          ),
          h('div', { class: 'd2map_AI-tab-content', id: 'd2map_AI-tab-circle' },
            h('table', null,
              h('tr', null,
                h('th', { 'data-lang': 'supposedLocation' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAIRadius', 'data-lang': 'radius' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 200, class: 'd2map_circle', id: 'd2map_ms-prop-edit-text-infoAIRadius', placeholder: '0' })
                )
              ),
              h('tr', null,
                h('th', { 'data-lang': 'supposedCircle' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-circle-infoAILineColor', 'data-lang': 'color' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', class: 'd2map_circle', id: 'd2map_ms-prop-edit-chk-circle-infoAILineColor', checked: 'checked' }),
                  h('input', { type: 'color', class: 'd2map_circle', id: 'd2map_ms-prop-edit-text-circle-infoAILineColor' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-circle-infoAILineWidth', 'data-lang': 'thickness' })
                ),
                h('td', null,
                  h('input', { type: 'number', step: '0.01', min: '0', max: 5.0, class: 'd2map_circle', id: 'd2map_ms-prop-edit-text-circle-infoAILineWidth', placeholder: '0.05' })
                ),
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAIFillColor', 'data-lang': 'fillcolor' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', class: 'd2map_circle', id: 'd2map_ms-prop-edit-chk-infoAIFillColor' }),
                  h('input', { type: 'color', class: 'd2map_circle', id: 'd2map_ms-prop-edit-text-infoAIFillColor' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-circle-infoAILineStyle', 'data-lang': 'dottedline' })
                ),
                h('td', null,
                  h('input', { type: 'text', class: 'd2map_circle', id: 'd2map_ms-prop-edit-text-circle-infoAILineStyle', placeholder: '' })
                )
              )
            )
          ),
          h('div', { class: 'd2map_AI-tab-content', id: 'd2map_AI-tab-line' },
            h('table', null,
              h('tr', null,
                h('th', { 'data-lang': 'supposedLocation' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAIStartLineX', 'data-lang': 'xCoordinate' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 300, class: 'd2map_line', id: 'd2map_ms-prop-edit-text-infoAIStartLineX', placeholder: '0' })
                )
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAIStartLineY', 'data-lang': 'yCoordinate' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 300, class: 'd2map_line', id: 'd2map_ms-prop-edit-text-infoAIStartLineY', placeholder: '0' })
                )
              ),
              h('tr', null,
                h('th', { 'data-lang': 'supposedCircle' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-line-infoAILineColor', 'data-lang': 'color' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', class: 'd2map_line', id: 'd2map_ms-prop-edit-chk-line-infoAILineColor', checked: 'checked' }),
                  h('input', { type: 'color', class: 'd2map_line', id: 'd2map_ms-prop-edit-text-line-infoAILineColor' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-line-infoAILineWidth', 'data-lang': 'thickness' })
                ),
                h('td', null,
                  h('input', { type: 'number', step: '0.01', min: '0', max: 5.0, class: 'd2map_line', id: 'd2map_ms-prop-edit-text-line-infoAILineWidth', placeholder: '0.05' })
                ),
              ),
              h('tr', null,
                h('td', null),
                h('td', null),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-line-infoAILineStyle', 'data-lang': 'dottedline' })
                ),
                h('td', null,
                  h('input', { type: 'text', class: 'd2map_line', id: 'd2map_ms-prop-edit-text-line-infoAILineStyle', placeholder: '' })
                )
              )
            )
          )
        )
      ),
      h('div', { class: 'd2map_popup-modal shadow', 'data-popup-modal': '2' },
        h('div', { class: "d2map_modal-header" },
          h('button', { class: 'd2map_popup-modal-close' }),
          h('h4', { 'data-lang': 'speedLeaderTrailer' })
        ),
        h('div', { class: 'd2map_ms-prop-edit-bottom-forAJ' },
          h('nav', null,
            h('div', { class: 'd2map_AJ-tab', 'data-index': '0', 'data-lang': 'aj_tab0' }),
            h('div', { class: 'd2map_AJ-tab', 'data-index': '1', 'data-lang': 'aj_tab1' }),
            h('span', { class: 'd2map_AJ-glider' })
          ),
          h('div', { class: 'd2map_AJ-tab-content active', id: 'd2map_AJ-none' },
            h('div', { 'data-lang': 'aj_content' }),
            h('button', { id: 'd2map_AJ-confirm-btn', 'data-lang': 'confirm' })
          ),
          h('div', { class: 'd2map_AJ-tab-content', id: 'd2map_AJ-speed' },
            h('table', null,
              h('tr', null,
                h('th', { 'data-lang': 'aj_speed' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAJMovingDirection', 'data-lang': 'movingDirection' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 360, id: 'd2map_ms-prop-edit-text-infoAJMovingDirection', placeholder: '0' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAJMovingSpeed', 'data-lang': 'movingSpeed' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 500, id: 'd2map_ms-prop-edit-text-infoAJMovingSpeed', placeholder: '0' })
                )
              ),
              h('tr', null,
                h('th', { 'data-lang': 'lengthCoditions' })
              ),
              h('tr', null,
                h('td', { 'data-lang': 'speedZone' }),
                h('td', { 'data-lang': 'lowSpeed' }),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 500, id: 'd2map_ms-prop-edit-text-infoAJSpeedRangeLower', placeholder: '40', value: '40' })
                ),
                h('td', { 'data-lang': 'mediumSpeed' }),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 500, id: 'd2map_ms-prop-edit-text-infoAJSpeedRangeUpper', placeholder: '80', value: '80' })
                ),
                h('td', { 'data-lang': 'highSpeed' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAJSpeedRangeLengthLow', 'data-lang': 'lowSpeedZone' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 100, id: 'd2map_ms-prop-edit-text-infoAJSpeedRangeLengthLow', placeholder: '6', value: '6' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAJSpeedRangeLengthMid', 'data-lang': 'mediumSpeedZone' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 100, id: 'd2map_ms-prop-edit-text-infoAJSpeedRangeLengthMid', placeholder: '12', value: '12' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAJSpeedRangeLengthHigh', 'data-lang': 'highSpeedZone' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 100, id: 'd2map_ms-prop-edit-text-infoAJSpeedRangeLengthHigh', placeholder: '18', value: '18' })
                )
              ),
              h('tr', null,
                h('th', { 'data-lang': 'properties' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAJLineColor', 'data-lang': 'color' })
                ),
                h('td', null,
                  h('input', { type: 'checkbox', id: 'd2map_ms-prop-edit-chk-infoAJLineColor', checked: 'checked' }),
                  h('input', { type: 'color', id: 'd2map_ms-prop-edit-text-infoAJLineColor' }),
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAJLineWidth', 'data-lang': 'thickness' })
                ),
                h('td', null,
                  h('input', { type: 'number', step: '0.01', min: '0', max: 5.0, id: 'd2map_ms-prop-edit-text-infoAJLineWidth', placeholder: '0.05' })
                )
              ),
              h('tr', null,
                h('td', null),
                h('td', null),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAJLineStyle', 'data-lang': 'dottedline' })
                ),
                h('td', null,
                  h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-infoAJLineStyle' })
                ),
              ),
              h('tr', null,
                h('th', { 'data-lang': 'tractionSensor' })
              ),
              h('tr', null,
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAJDynamicLength', 'data-lang': 'aj_distance' })
                ),
                h('td', null,
                  h('input', { type: 'number', min: '0', max: 500, id: 'd2map_ms-prop-edit-text-infoAJDynamicLength', placeholder: '0' })
                ),
                h('td', null,
                  h('label', { for: 'd2map_ms-prop-edit-text-infoAJDynamicSize', 'data-lang': 'aj_size' })
                ),
                h('td', null,
                  h('input', { type: 'number', step: '0.1', min: '0', max: 5.0, id: 'd2map_ms-prop-edit-text-infoAJDynamicSize', placeholder: '0.2' })
                )
              )
            )
          )
        )
      )
    )
  )

  const tabContainerForNonPoint = (
    h('div', { class: 'd2map_tab-container' },
      h('ul', { class: 'd2map_tab-controller', id: 'd2map_ms-tab-controller' },
        h('li', { class: 'd2map_selected', id: 'd2map_sidc-tab', 'data-tab': 'sidc-content', 'data-lang': 'basic' }),
        h('li', { id: 'd2map_extend-tab', 'data-tab': 'extend-content', 'data-lang': 'extension' })
      ),
      h('div', { class: 'd2map_tab-content', id: 'd2map_ms-tab-content' },
        h('div', { class: 'd2map_sidc-content' },
          h('span', { class: 'd2map_tab-title', id: 'd2map_ms-nonpoint-name' }, 'sidc:name'),
          h('table', null,
            h('tr', null,
              h('td', { 'data-lang': 'affiliation' }),
              h('td', { class: 'd2map_content_input' },
                h('select', { id: 'd2map_ms-style-nonpoint-aff', name: 'ms-style-input' },
                  h('option', { value: 'P', 'data-lang': 'aff_p' }),
                  h('option', { value: 'U', 'data-lang': 'aff_u' }),
                  h('option', { value: 'F', selected: 'selected', 'data-lang': 'aff_f' }),
                  h('option', { value: 'N', 'data-lang': 'aff_n' }),
                  h('option', { value: 'H', 'data-lang': 'aff_h' }),
                  h('option', { value: 'A', 'data-lang': 'aff_a' }),
                  h('option', { value: 'S', 'data-lang': 'aff_s' }),
                  h('option', { value: 'G', 'data-lang': 'aff_g' }),
                  h('option', { value: 'W', 'data-lang': 'aff_w' }),
                  h('option', { value: 'D', 'data-lang': 'aff_d' }),
                  h('option', { value: 'L', 'data-lang': 'aff_l' }),
                  h('option', { value: 'M', 'data-lang': 'aff_m' }),
                  h('option', { value: 'J', 'data-lang': 'aff_j' }),
                  h('option', { value: 'K', 'data-lang': 'aff_k' })
                )
              )
            ),

            h('tr', { class: 'd2map_status' },
              h('td', { 'data-lang': 'status' }),
              h('td', { class: 'd2map_content_input' },
                h('select', { id: 'd2map_ms-style-nonpoint-status', name: 'ms-style-input' },
                  h('option', { value: '-' }, '-'),
                  h('option', { value: 'A', 'data-lang': 'status_a' }),
                  h('option', { value: 'S', 'data-lang': 'status_s' }),
                  h('option', { value: 'P', 'data-lang': 'status_p' }),
                  h('option', { value: 'K', 'data-lang': 'status_k' })
                )
              )
            ),

            h('tr', { class: 'd2map_status_weather' },
              h('td', { 'data-lang': 'status' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('select', { id: 'd2map_ms-prop-edit-select-status_ex_weather', name: 'ms-prop-edit-select' },
                  h('option', { value: '-' }, '-'),
                )
              )
            ),

            h('tr', null,
              h('td', { "data-lang": "size" }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'number', id: 'd2map_ms-style-nonpoint-size', name: 'ms-style-input' })
              )
            ),
            h('tr', null,
              h('td', { 'data-lang': 'opacity' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'number', id: 'd2map_ms-style-nonpoint-opacity', name: 'ms-style-input', title: '0 ~ 255' })
              )
            ),
            h('tr', null,
              h('td', null,
                h('input', { type: 'checkbox', id: 'd2map_ms-style-nonpoint-defineColor', name: 'ms-style-input' }),
                h('label', { for: 'd2map_ms-style-nonpoint-defineColor', 'data-lang': 'userDefineFillColor' })
              ),
              h('td', { class: 'd2map_content_input' },
                h('table', null,
                  h('td', null,
                    h('label', { for: 'd2map_ms-style-nonpoint-defineColor-useLineColor', 'data-lang': 'userDefineFillColorOption' }),
                    h('input', { type: 'checkbox', id: 'd2map_ms-style-nonpoint-defineColor-useLineColor', name: 'ms-style-input' }),
                  ),
                  h('td', null,
                    h('input', { type: 'color', id: 'd2map_ms-style-nonpoint-defineColor-stroke', name: 'ms-style-input' })
                  ),
                  h('td', null,
                    h('label', { style: 'display: none;', 'data-lang': 'opacity_line' })
                  ),
                  h('td', null,
                    h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-strokeAlpha', name: 'ms-style-input', style: 'display: none;' })
                  )
                )
              )
            ),
            h('tr', { id: 'd2map_ms-style-nonpoint-fillRow' },
              h('td', null),
              h('td', { class: 'd2map_content_input' },
                h('table', null,
                  h('td', null,
                    h('label', { for: 'd2map_ms-style-nonpoint-defineColor-useFillColor', 'data-lang': 'sideColorOption' }),
                    h('input', { type: 'checkbox', id: 'd2map_ms-style-nonpoint-defineColor-useFillColor', name: 'ms-style-input' }),
                  ),
                  h('td', null,
                    h('input', { type: 'color', id: 'd2map_ms-style-nonpoint-defineColor-fill', name: 'ms-style-input' })
                  ),
                  h('td', null,
                    h('label', { style: 'display: none;', 'data-lang': 'opacity_plane' })
                  ),
                  h('td', null,
                    h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-fillAlpha', name: 'ms-style-input', style: 'display: none;' })
                  )
                )
              )
            ),
            h('tr', null,
              h('td', { 'data-lang': 'strokeWidth' }),
              h('td', { class: 'd2map_content_input' },
                h('select', { type: 'text', id: 'd2map_ms-style-nonpoint-lineWidth', name: 'ms-style-input' },
                  h('option', { value: '0.5', 'data-lang': 'strokeWidth_thin' }),
                  h('option', { value: '1', 'data-lang': 'strokeWidth_medium' }),
                  h('option', { value: '3', 'data-lang': 'strokeWidth_thick' })
                )
              )
            ),
            h('tr', { class: 'd2map_textSize' },
              h('td', { 'data-lang': 'textSize' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'number', id: 'd2map_ms-style-nonpoint-textSize', step: "0.1", min: '0', max: 5, name: 'ms-style-input' })
              )
            ),
          )
        ),
        h('div', { class: 'd2map_extend-content' },
          h('table', { id: 'd2map_ms-prop-info' },
            h('tr', { class: 'd2map_icon-code' },
              h('td', { 'data-lang': 'iconSymbolCode' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-A', name: 'ms-style-input', readonly: 'true' }),
                h('a', { class: 'd2map_btn', id: 'd2map_ms-style-button-icon', name: 'ms-style-sidc' }, '...'),
                // h('a', { class: 'd2map_btn', id: 'd2map_ms-style-button-property', name: 'ms-style-sidc' }, '속성')
              )
            ),
            h('tr', { class: 'd2map_echelon' },
              h('td', { 'data-lang': 'echelon_bottom' }),
              h('td', { class: 'd2map_content_input' },
                h('select', { id: 'd2map_ms-style-nonpoint-info-B', name: 'ms-style-input' })
              )
            ),
            h('tr', { class: 'd2map_echelon1' },
              h('td', { 'data-lang': 'echelon_top' }),
              h('td', { class: 'd2map_content_input' },
                h('select', { id: 'd2map_ms-style-nonpoint-info-B1', name: 'ms-style-input' })
              )
            ),
            h('tr', { class: 'd2map_echelon2' },
              h('td', { 'data-lang': 'echelon_left' }),
              h('td', { class: 'd2map_content_input' },
                h('select', { id: 'd2map_ms-style-nonpoint-info-B2', name: 'ms-style-input' })
              )
            ),
            h('tr', { class: 'd2map_echelon3' },
              h('td', { 'data-lang': 'echelon_right' }),
              h('td', { class: 'd2map_content_input' },
                h('select', { id: 'd2map_ms-style-nonpoint-info-B3', name: 'ms-style-input' })
              )
            ),
            h('tr', { class: 'd2map_quantity' },
              h('td', { id: 'd2map_ms-style-nonpoint-info-C-text', 'data-lang': 'quantity' }), //G*G*GL5C--****X, G*G*GL5D--****에서 "전송속도"로 사용됨
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-C', name: 'ms-style-input' })
              )
            ),
            h('tr', { class: 'd2map_additionalInformation' },
              h('td', { id: 'd2map_ms-style-nonpoint-info-H-text', 'data-lang': 'activity' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-H', name: 'ms-style-input', maxlength: '20', 'data-placeholder': 'activityPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_additionalInformation' },
              h('td', { id: 'd2map_ms-style-nonpoint-info-H-text', 'data-lang': 'activity0' }), //G*G*GL5C--****X, G*G*GL5D--****에서 사용됨
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-H3', name: 'ms-style-input', maxlength: '20', 'data-placeholder': 'activity0Placeholder' })
              )
            ),
            h('tr', { class: 'd2map_additionalInformation1' },
              h('td', { 'data-lang': 'activity1' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-H1', name: 'ms-style-input', maxlength: '20', 'data-placeholder': 'activity1Placeholder' })
              )
            ),
            h('tr', { class: 'd2map_additionalInformation2' },
              h('td', { 'data-lang': 'activity2' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-H2', name: 'ms-style-input', maxlength: '20', 'data-placeholder': 'activity2Placeholder' })
              )
            ),
            h('tr', { class: 'd2map_hostile' },
              h('td', { 'data-lang': 'hostile' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-N', name: 'ms-style-input', maxlength: '3', 'data-placeholder': 'hostilePlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_direction' },
              h('td', { 'data-lang': 'direction' },
                h('br', { 'data-lang': 'directionStandard' })
              ),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-Q', name: 'ms-style-input', min: '0', max: '360' })
              )
            ),
            h('tr', { class: 'd2map_uniqueDesignation' },
              h('td', { id: 'd2map_ms-style-nonpoint-info-T-text', 'data-lang': 'uniqueDesignation' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-T', name: 'ms-style-input', maxlength: '15', 'data-placeholder': 'uniqueDesignationPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_uniqueDesignation1' },
              h('td', { 'data-lang': 'uniqueDesignation1' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-T1', name: 'ms-style-input', maxlength: '15', 'data-placeholder': 'uniqueDesignation1Placeholder' })
              )
            ),
            h('tr', { class: 'd2map_uniqueDesignation' },
              h('td', { 'data-lang': 'uniqueDesignation2' }), //G*G*GL5C--****X, G*G*GL5D--****에서 사용됨
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-T2', name: 'ms-style-input', maxlength: '15', 'data-placeholder': 'uniqueDesignation2Placeholder' })
              )
            ),
            h('tr', { class: 'd2map_dtg' },
              h('td', { 'data-lang': 'dtg' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-W', name: 'ms-style-input', maxlength: '16', 'data-placeholder': 'dtgPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_dtg1' },
              h('td', { 'data-lang': 'dtg1' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-W1', name: 'ms-style-input', maxlength: '16', 'data-placeholder': 'dtgPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_altitudeDepth' },
              h('td', { id: 'd2map_ms-style-nonpoint-info-X-text', 'data-lang': 'altitudeDepth' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-X', name: 'ms-style-input', maxlength: '14', 'data-placeholder': 'altitudeDepthPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_altitudeDepth1' },
              h('td', { id: 'd2map_ms-style-nonpoint-info-X1-text', 'data-lang': 'x1altitudeDepthDistance' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-X1', name: 'ms-style-input', maxlength: '14', 'data-placeholder': 'altitudeDepthPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_altitudeDepth2' },
              h('td', { 'data-lang': 'x2Distance' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-X2', name: 'ms-style-input', maxlength: '14', 'data-placeholder': 'x2DistancePlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_altitudeDepth3' },
              h('td', { 'data-lang': 'x3Distance' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-X3', name: 'ms-style-input', maxlength: '14', 'data-placeholder': 'x3DistancePlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_distance' },
              h('td', { 'data-lang': 'am' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AM', name: 'ms-style-input', maxlength: '6', 'data-placeholder': 'amPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_distance1' },
              h('td', { 'data-lang': 'am1' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AM1', name: 'ms-style-input', maxlength: '6', 'data-placeholder': 'amPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_distance2' },
              h('td', { 'data-lang': 'am2' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AM2', name: 'ms-style-input', maxlength: '6', 'data-placeholder': 'amPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_distance3' },
              h('td', { 'data-lang': 'am3' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AM3', name: 'ms-style-input', maxlength: '6', 'data-placeholder': 'amPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_angle' },
              h('td', { 'data-lang': 'an' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AN', name: 'ms-style-input', maxlength: '3', 'data-placeholder': 'anPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_angle1' },
              h('td', { 'data-lang': 'an1' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AN1', name: 'ms-style-input', maxlength: '3', 'data-placeholder': 'anPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_angle2' },
              h('td', { 'data-lang': 'an2' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AN2', name: 'ms-style-input', maxlength: '3', 'data-placeholder': 'anPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_angle3' },
              h('td', { 'data-lang': 'an3' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AN3', name: 'ms-style-input', maxlength: '3', 'data-placeholder': 'anPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_angle4' },
              h('td', { 'data-lang': 'an4' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AN4', name: 'ms-style-input', maxlength: '3', 'data-placeholder': 'anPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_angle5' },
              h('td', { 'data-lang': 'an5' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AN5', name: 'ms-style-input', maxlength: '3', 'data-placeholder': 'anPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_angle6' },
              h('td', { 'data-lang': 'an6' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AN6', name: 'ms-style-input', maxlength: '3', 'data-placeholder': 'anPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_angle7' },
              h('td', { 'data-lang': 'an7' }),
              h('td', { class: 'd2map_content_input' },
                h('input', { type: 'text', id: 'd2map_ms-style-nonpoint-info-AN7', name: 'ms-style-input', maxlength: '3', 'data-placeholder': 'anPlaceholder' })
              )
            )
          )
        )
      )
    )
  );

  const headerForSIDC = (
    h('div', { class: 'd2map_header' },
      h('div', { class: 'd2map_title', 'data-lang': 'sidcTitle' }), //SIDC Selector
      h('a', { href: '#', class: "d2map_popup-close-btn" })
      //h('button', { class: 'd2map_ms-prop-edit-close' }, 'x')
    )
  );
  const treeContainerForSIDC = (
    h('div', { id: 'd2map_tree-container-msSIDC' },
      h('ul', { class: 'd2map_ztree', id: 'd2map_msSIDCTree' }),
      h('div', { id: 'd2map_ms-sidc-info' },
        h('div', { id: 'd2map_ms-sidc-name', 'data-lang': 'sidcName' },
          h('font', { id: 'd2map_ms-sidc-name-code' })
        ),
        h('div', { id: 'd2map_ms-sidc-preview' })
      )
    )
  );
  const sidcControllerForSIDC = (
    h('div', { id: 'd2map_ms-sidc-controller' },
      h('div', { id: 'd2map_ms-sidc-controller-option' },
        h('select', { id: 'd2map_ms-sidc-controller-affiliation' },
          h('option', { value: 'P', 'data-lang': 'aff_p' }),
          h('option', { value: 'U', 'data-lang': 'aff_u' }),
          h('option', { value: 'F', selected: 'selected', 'data-lang': 'aff_f' }),
          h('option', { value: 'N', 'data-lang': 'aff_n' }),
          h('option', { value: 'H', 'data-lang': 'aff_h' }),
          h('option', { value: 'A', 'data-lang': 'aff_a' }),
          h('option', { value: 'S', 'data-lang': 'aff_s' }),
          h('option', { value: 'G', 'data-lang': 'aff_g' }),
          h('option', { value: 'W', 'data-lang': 'aff_w' }),
          h('option', { value: 'D', 'data-lang': 'aff_d' }),
          h('option', { value: 'L', 'data-lang': 'aff_l' }),
          h('option', { value: 'M', 'data-lang': 'aff_m' }),
          h('option', { value: 'J', 'data-lang': 'aff_j' }),
          h('option', { value: 'K', 'data-lang': 'aff_k' })
        )
      ),
      h('div', { id: 'd2map_ms-sidc-controller-btns' },
        h('a', { href: '#', id: 'd2map_ms-sidc-controller-btns-property', 'data-lang': 'properties' })
      )
    )
  );

  const headerForPoint = (
    h('div', { class: 'd2map_header' },
      h('div', { class: 'd2map_title', 'data-lang': 'title' }), //Military Symbol Properties
      h('a', { href: '#', class: "d2map_popup-close-btn", id: 'd2map_ms-prop-edit-close_ex' })
      //h('button', { class: 'd2map_ms-prop-edit-close', id: 'd2map_ms-prop-edit-close_ex' }, 'x')
    )
  );

  const leftSectionForPoint = (
    h('div', { class: 'd2map_content_left_section' },
      h('div', { class: 'd2map_sidc_div' },
        h('span', { class: 'd2map_sidc_span', id: 'd2map_ms-prop-edit-sidc_ex' }, 'XXXXXYYYYYZZZZZ')
      ),
      h('div', { class: 'd2map_img_container', id: 'd2map_ms-prop-edit-img-container_ex' })
    )
  );

  const tabContainerForPoint = (
    h('div', { class: 'd2map_tab-container_ex' },
      h('ul', { class: 'd2map_tab-controller', id: 'd2map_ms-tab-controller_ex' },
        h('li', { class: 'd2map_selected', id: 'd2map_sidc-tab_ex', 'data-tab': 'sidc-content_ex', 'data-lang': 'basic' }),
        h('li', { id: 'd2map_extend-tab_ex', 'data-tab': 'extend-content_ex', 'data-lang': 'extension' })
      ),
      h('div', { class: 'd2map_tab-content', id: 'd2map_ms-tab-content_ex' },
        h('div', { class: 'd2map_sidc-content_ex' },
          h('table', null,
            h('tr', null,
              h('td', { 'data-lang': 'affiliation' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('select', { class: 'd2map_fixed-width-small', id: 'd2map_ms-prop-edit-select-affiliation_ex', name: 'ms-prop-edit-select_ex' },
                  h('option', { value: 'P', 'data-lang': 'aff_p' }),
                  h('option', { value: 'U', 'data-lang': 'aff_u' }),
                  h('option', { value: 'F', selected: 'selected', 'data-lang': 'aff_f' }),
                  h('option', { value: 'N', 'data-lang': 'aff_n' }),
                  h('option', { value: 'H', 'data-lang': 'aff_h' }),
                  h('option', { value: 'A', 'data-lang': 'aff_a' }),
                  h('option', { value: 'S', 'data-lang': 'aff_s' }),
                  h('option', { value: 'G', 'data-lang': 'aff_g' }),
                  h('option', { value: 'W', 'data-lang': 'aff_w' }),
                  h('option', { value: 'D', 'data-lang': 'aff_d' }),
                  h('option', { value: 'L', 'data-lang': 'aff_l' }),
                  h('option', { value: 'M', 'data-lang': 'aff_m' }),
                  h('option', { value: 'J', 'data-lang': 'aff_j' }),
                  h('option', { value: 'K', 'data-lang': 'aff_k' })
                )
              )
            ),

            h('tr', { class: 'd2map_status' },
              h('td', { 'data-lang': 'status' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('select', { id: 'd2map_ms-prop-edit-select-status_ex', name: 'ms-prop-edit-select_ex' },
                  h('option', { value: '-' }, '-'),
                  h('option', { value: 'A', 'data-lang': 'status_a' }),
                  h('option', { value: 'S', 'data-lang': 'status_s' }),
                  h('option', { value: 'P', 'data-lang': 'status_p' }),
                  h('option', { value: 'K', 'data-lang': 'status_k' })
                )
              )
            ),


            h('tr', { class: 'd2map_status_weather' },
              h('td', { 'data-lang': 'status' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('select', { id: 'd2map_ms-prop-edit-select-status_weather', name: 'ms-prop-edit-select_ex' },
                  h('option', { value: '-' }, '-')
                )
              )
            ),


            h('tr', null,
              h('td', { "data-lang": "size" }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'number', min: '3', max: '14', id: 'd2map_ms-prop-edit-text-size_ex', name: 'ms-prop-edit-text_ex', value: '7' }),
              )
            ),
            h('tr', null,
              h('td', { 'data-lang': 'opacity' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'number', id: 'd2map_ms-prop-edit-text-opacity_ex', name: 'ms-prop-edit-text_ex' })
              )
            ),
            h('tr', null,
              h('td', null,
                h('label', { 'data-lang': 'userDefineFillColor' })
              ),
              h('td', { class: 'd2map_content_input_ex' },
                h('table', null,
                  h('td', { class: 'd2map_content_input_ex' },
                    h('input', { type: 'checkbox', id: 'd2map_ms-style-defineColor_ex', name: 'ms-prop-edit-text_ex' }),
                    h('input', { type: 'color', id: 'd2map_ms-style-defineColor-stroke_ex', name: 'ms-prop-edit-text_ex' })
                  )
                )
              )
            ),

            h('tr', null,
              h('td', null,
                h('label', { for: 'd2map_ms-prop-edit-text-strokeWidth_ex', 'data-lang': 'strokeWidth' })
              ),
              h('td', { class: 'd2map_content_input_ex' },
                h('select', { id: 'd2map_ms-prop-edit-text-strokeWidth_ex', name: 'ms-prop-edit-select_ex' },
                  h('option', { value: '2', 'data-lang': 'strokeWidth_thin' }),
                  h('option', { value: '4', 'data-lang': 'strokeWidth_medium', selected: true }),
                  h('option', { value: '6', 'data-lang': 'strokeWidth_thick' })
                )
              )
            ),

            h('tr', { class: 'd2map_textSize' },
              h('td', { 'data-lang': 'textSize' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-textSize_ex', name: 'ms-prop-edit-text_ex' })
              )
            ),
          )
        ),
        h('div', { class: 'd2map_extend-content_ex' },
          h('table', { id: 'd2map_ms-prop-info' },
            h('tr', { class: 'd2map_icon-code' },
              h('td', { 'data-lang': 'iconSymbolCode' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('select', { id: 'd2map_ms-prop-edit-select-addsymbol_ex', name: 'ms-prop-edit-select_ex' })
              )
            ),
            h('tr', { class: 'd2map_quantity' },
              h('td', { 'data-lang': 'quantity' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-quantity_ex', name: 'ms-prop-edit-text_ex', maxlength: '6' })
              )
            ),
            h('tr', { class: 'd2map_additionalInformation' },
              h('td', { id: 'd2map_ms-style-nonpoint-info-H-text', 'data-lang': 'activity' }), //G*O*D-----****X에서 "추가상황(적용수위 등)"로 사용됨
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-additionalInformation_ex', name: 'ms-prop-edit-text_ex', maxlength: '20', 'data-placeholder': 'activityPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_additionalInformation1' },
              h('td', { 'data-lang': 'activity1' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-additionalInformation1_ex', name: 'ms-prop-edit-text_ex', maxlength: '20', 'data-placeholder': 'activity1Placeholder' })
              )
            ),
            h('tr', { class: 'd2map_hostile' },
              h('td', { 'data-lang': 'hostile' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-hostile_ex', name: 'ms-prop-edit-text_ex', maxlength: '3', 'data-placeholder': 'hostilePlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_direction' },
              h('td', { 'data-lang': 'direction' },
                h('br', { 'data-lang': 'directionStandard' })
              ),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-direction_ex', name: 'ms-prop-edit-text_ex', placeholder: '0 ~ 360' })
              )
            ),
            h('tr', { class: 'd2map_speed' },
              h('td', { 'data-lang': 'speed' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-speed_ex', name: 'ms-prop-edit-text_ex', 'data-placeholder': 'speedPlaceholderNum' })
              )
            ),
            h('tr', { class: 'd2map_uniqueDesignation' },                            //G*O*D-----****X에서 "댐명칭"로 사용됨
              h('td', { id: 'd2map_ms-style-nonpoint-info-T-text', 'data-lang': 'uniqueDesignation' }), //T: 노드(부대)번호는 언제 사용되는지 확인 필요
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-uniqueDesignation_ex', name: 'ms-prop-edit-text_ex', maxlength: '15', 'data-placeholder': 'uniqueDesignationPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_uniqueDesignation1' },
              h('td', { id: 'd2map_ms-style-nonpoint-info-T1-text', 'data-lang': 'uniqueDesignation1' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-uniqueDesignation1_ex', name: 'ms-prop-edit-text_ex', maxlength: '15', 'data-placeholder': 'uniqueDesignation1Placeholder' })
              )
            ),
            h('tr', { class: 'd2map_type' }, //작전활동부호 점형 V 추가
              h('td', { 'data-lang': 'type' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-type_ex', name: 'ms-prop-edit-text_ex', maxlength: '24', 'data-placeholder': 'typePlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_dtg' },
              h('td', { 'data-lang': 'dtg' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-dtg_ex', name: 'ms-prop-edit-text_ex', maxlength: '16', 'data-placeholder': 'dtgPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_dtg1' },
              h('td', { 'data-lang': 'dtg1' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-dtg1_ex', name: 'ms-prop-edit-text_ex', maxlength: '16', 'data-placeholder': 'dtgPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_altitudeDepth' },
              h('td', { 'data-lang': 'altitudeDepth' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-altitudeDepth_ex', name: 'ms-prop-edit-text_ex', maxlength: '14', 'data-placeholder': 'altitudeDepthPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_altitudeDepth1' },
              h('td', { 'data-lang': 'x1altitudeDepthDistance' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-altitudeDepth1_ex', name: 'ms-prop-edit-text_ex', maxlength: '14', 'data-placeholder': 'altitudeDepthPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_location' }, //작전활동부호 점형 Y 추가
              h('td', { 'data-lang': 'location' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'text', id: 'd2map_ms-prop-edit-text-location_ex', name: 'ms-prop-edit-text_ex', maxlength: '19', 'data-placeholder': 'locationPlaceholder' })
              )
            ),
            h('tr', { class: 'd2map_color-properties' },
              h('td', { 'data-lang': 'colorsettings' }),
              h('td', { class: 'd2map_content_input_ex' },
                h('input', { type: 'color', id: 'd2map_ms-prop-edit-color-properties_ex', value: '#000000' })
              )
            ),
          )
        )
      )
    )
  );

  bodyElement.prepend(divContainer);
  bodyElement.prepend(divPopUp);
  bodyElement.prepend(divContainerNonPoint);
  bodyElement.prepend(divContainerSIDC);
  bodyElement.prepend(divContainerEx);

  // 군대부호 속성 정보 팝업 - 기본군대부호
  divContainer.appendChild(createElement(header));
  divContainer.appendChild(createElement(leftSection));
  divContainer.appendChild(createElement(rightSection));
  divPopUp.appendChild(createElement(popupModal));

  // 군대부호 속성 정보 팝업 - 작전활동부호 선형/면형
  divContainerNonPoint.appendChild(createElement(header));
  divContainerNonPoint.appendChild(createElement(tabContainerForNonPoint));
  let nonPointB = document.getElementById("d2map_ms-style-nonpoint-info-B");
  let nonPointB1 = document.getElementById("d2map_ms-style-nonpoint-info-B1");
  let nonPointB2 = document.getElementById("d2map_ms-style-nonpoint-info-B2");
  let nonPointB3 = document.getElementById("d2map_ms-style-nonpoint-info-B3");
  let fragment = new DocumentFragment();
  let fragment1 = new DocumentFragment();
  let fragment2 = new DocumentFragment();
  let fragment3 = new DocumentFragment();
  const options = [
    '- : None',
    'A : 조',
    'B : 분대',
    'C : 반',
    'D : 소대',
    'E : 중대, 포대',
    'F : 대대',
    'G : 연대, 단',
    'H : 여단, 전단',
    'I : 사단, 함대, 비행단',
    'J : 군단, 작전사령부',
    'K : 야전군',
    'L : 집단군',
    'M : 지역군',
    'P : 대',
    'Q : 지역대',
    'R : 군수지원대대',
    'S : 군수지원단',
    'T : 군수지원사',
    'U : 군수지원부',
    'V : 출장소, 파견소, 어통소',
    'W : 지소, 파출소',
    'X : 경찰서, 지구해양경찰대',
    'Y : 경찰국, 해양경찰대',
    'N : 지휘'
  ];
  const optionsDataSet = [
    'echelon_none',
    'echelon_a',
    'echelon_b',
    'echelon_c',
    'echelon_d',
    'echelon_e',
    'echelon_f',
    'echelon_g',
    'echelon_h',
    'echelon_i',
    'echelon_j',
    'echelon_k',
    'echelon_l',
    'echelon_m',
    'echelon_p',
    'echelon_q',
    'echelon_r',
    'echelon_s',
    'echelon_t',
    'echelon_u',
    'echelon_v',
    'echelon_w',
    'echelon_x',
    'echelon_y',
    'echelon_n'
  ];
  options.forEach(function (option, i) {
    let optionTag = document.createElement('option');
    optionTag.innerHTML = option;
    optionTag.value = option.split('')[0];
    optionTag.dataset.lang = optionsDataSet[i];
    fragment.appendChild(optionTag);
    fragment1.appendChild(optionTag.cloneNode(true));
    fragment2.appendChild(optionTag.cloneNode(true));
    fragment3.appendChild(optionTag.cloneNode(true));
  });


  nonPointB.appendChild(fragment);
  nonPointB1.appendChild(fragment1);
  nonPointB2.appendChild(fragment2);
  nonPointB3.appendChild(fragment3);

  // 군대부호 속성 정보 팝업 - 작전활동부호 sidc selector
  divContainerSIDC.appendChild(createElement(headerForSIDC));
  divContainerSIDC.appendChild(createElement(treeContainerForSIDC));
  divContainerSIDC.appendChild(createElement(sidcControllerForSIDC));

  // 군대부호 속성 정보 팝업 - 작전활동부호 점형
  divContainerEx.appendChild(createElement(headerForPoint));
  divContainerEx.appendChild(createElement(leftSectionForPoint));
  divContainerEx.appendChild(createElement(tabContainerForPoint));

  // 군대부호 draggable 적용
  $('#d2map_ms_prop_container').draggable({ containment: 'div#d2map_map'/*, handle: '.d2map_title'*/ });
  $('#d2map_ms_prop_container_nonpoint').draggable({ containment: 'div#d2map_map'/*, handle: '.d2map_title'*/ });
  $('#d2map_ms_prop_container_ex').draggable({ containment: 'div#d2map_map'/*, handle: '.d2map_title'*/ });
  $('#d2map_ms_prop_container_sidc').draggable({ containment: 'div#d2map_map'/*, handle: '.d2map_title'*/ });
  /************************************************************************************** */
});
