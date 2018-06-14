<?php

function prices() {
  add_meta_box(
    'prices',
    'Prezzi',
    'prices_callback',
    'appartamento',
    'normal',
    'default'
  );
}
add_action( 'add_meta_boxes', 'prices' );
function prices_callback($post) {
  wp_nonce_field( 'prices_nonce_name', 'prices_nonce' );
  $prices = get_post_meta( $post -> ID, 'prices', true );
  $prices = $prices ? $prices : '{}';
  ?>
  <textarea class="widefat" style="display: none;" name="prices"><?php echo $prices; ?></textarea>

  <h3>Imposta il prezzo per questo appartamento</h3>
  <div id="istruzioni">
    <p><b>Istruzioni:</b> seleziona il giorno o i giorni per i quali vuoi inserire un prezzo e digita la cifra nel campo prezzo</p>
    <p><span class="square selected"></span> prezzo impostato</p>
    <p><span class="square chosen"></span> data selezionata, campo prezzo pronto a ricevere</p>
    <p><span class="square selected chosen"></span> prezzo impostato e data selezionata, stai cambiando un prezzo già presente</p>
    <p>Puoi fare <b>selezioni multiple</b>, in questo caso viene impostato lo stesso prezzo per tutti i giorni che hai selezionato</p>
    <p>Puoi <b>selezionare tutti i giorni</b> del mese cliccando sul nome del mese</p>
    <p>Per <b>deselezionare</b> clicca fuori dal calendario</p>
    <p>Ricorda di <b>salvare le modifiche</b> prima di chiudere la pagina</p>
  </div>

  <link rel="stylesheet" type="text/css" href="<?php echo get_template_directory_uri(); ?>/css/metabox_prices_calendario.css">
  <div class="cControls">
    <div class="cControl yearSelect">
      Anno:
      <input type="number" min="<?php echo date('Y'); ?>" max="2030" step="1" name="calendarYear" value="<?php echo date("Y"); ?>">
    </div>
    <div class="cControl priceInput">
      Prezzo:
      <input type="text" size="8" name="dayPrice" disabled>
      €
    </div>
  </div>
  <div id="calendar"></div>
  <script src="<?php echo get_template_directory_uri(); ?>/js/calendario.js"></script>
  <script src="<?php echo get_template_directory_uri(); ?>/js/calendarioPrezzi.js"></script>
  <?php
}
function prices_save_function( $post_id ) {
  if ( !isset($_POST['prices_nonce']) ) return;
  if ( !wp_verify_nonce( $_POST['prices_nonce'], 'prices_nonce_name' ) ) return;
  if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
  if ( !current_user_can( 'edit_post', $post_id ) ) return;
  if ( is_multisite() && ms_is_switched() ) return $post_id;
  if ( !isset($_POST['prices']) || $_POST['prices'] == '' ) $_POST['prices'] = '{}';
  update_post_meta( $post_id, 'prices', $_POST['prices'] );
}
add_action( 'save_post', 'prices_save_function' );