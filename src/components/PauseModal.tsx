import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { Play, House, MenuSquare } from 'lucide-react-native'

import { References } from '@/src/components/References'
import { ColorsTheme } from '@/src/theme/colors'
import { horizontalScale, isTablet, verticalScale } from '@/src/theme/scaling'

interface PauseModalProps {
   visible: boolean
   onResume: () => void
   onGoHome: () => void
   onStageSelect: () => void
}

export const PauseModal: React.FC<PauseModalProps> = ({
   visible,
   onResume,
   onGoHome,
   onStageSelect,
}) => {
   return (
      <Modal visible={visible} transparent animationType="fade">
         <View style={styles.overlay}>
            <View style={styles.modalContainer}>
               <Text style={styles.modalTitle}>Jogo Pausado</Text>

               <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.buttonContinue} onPress={onResume}>
                     <Play size={20} color={ColorsTheme.orange100} />
                     <Text style={styles.buttonTextContinue}>Continuar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button} onPress={onStageSelect}>
                     <MenuSquare size={20} color={ColorsTheme.blue200} />
                     <Text style={styles.buttonText}>Seleção de Fases</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button} onPress={onGoHome}>
                     <House size={20} color={ColorsTheme.blue200} />
                     <Text style={styles.buttonText}>Voltar para o Início</Text>
                  </TouchableOpacity>
               </View>

               <References color={ColorsTheme.orange70} />
            </View>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   modalContainer: {
      backgroundColor: ColorsTheme.orange50,
      padding: verticalScale(32),
      borderRadius: 16,
      alignItems: 'center',
      width: '85%',
      shadowColor: ColorsTheme.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 15,
   },
   modalTitle: {
      fontSize: isTablet ? 32 : 28,
      fontFamily: 'PixelifySans-Bold',
      color: ColorsTheme.blue500,
      marginBottom: verticalScale(24),
   },
   modalButtons: {
      gap: 12,
      width: '100%',
   },
   button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: ColorsTheme.blue150,
      borderWidth: 2,
      borderColor: ColorsTheme.blue200,
      paddingVertical: verticalScale(14),
      paddingHorizontal: horizontalScale(24),
      borderRadius: 10,
      gap: 8,
   },
   buttonContinue: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: ColorsTheme.orange40,
      borderWidth: 2,
      borderColor: ColorsTheme.orange100,
      paddingVertical: verticalScale(14),
      paddingHorizontal: horizontalScale(24),
      borderRadius: 10,
      gap: 8,
   },
   buttonTextContinue: {
      fontSize: isTablet ? 22 : 18,
      fontFamily: 'PixelifySans-Bold',
      color: ColorsTheme.orange100,
   },
   buttonText: {
      fontSize: isTablet ? 22 : 18,
      fontFamily: 'PixelifySans-Bold',
      color: ColorsTheme.blue200,
   },
})