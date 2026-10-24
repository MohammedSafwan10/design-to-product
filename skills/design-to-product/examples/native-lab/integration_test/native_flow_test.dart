import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:design_evidence/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets('native Windows transit, audio and playable relay evidence', (
    tester,
  ) async {
    const output = String.fromEnvironment('EVIDENCE_DIR');
    if (output.isEmpty) {
      throw StateError('Pass an explicit EVIDENCE_DIR for local artifacts.');
    }
    final captures = <Map<String, Object?>>[];
    Future<void> capture(String name) async {
      await tester.pumpAndSettle();
      final boundary =
          app.evidenceBoundary.currentContext!.findRenderObject()!
              as RenderRepaintBoundary;
      final image = await boundary.toImage(pixelRatio: 1);
      final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
      await tester.runAsync(() async {
        await Directory(output).create(recursive: true);
        await File('$output/$name.png')
            .writeAsBytes(bytes!.buffer.asUint8List());
      });
      captures.add({
        'name': name,
        'width': image.width,
        'height': image.height,
        'artifact': '$name.png',
        'method': 'RepaintBoundary of the running native Flutter app; OS chrome excluded',
      });
      image.dispose();
      expect(tester.takeException(), isNull);
    }

    app.main();
    await tester.pumpAndSettle();
    final semantics = tester.ensureSemantics();
    await capture('transit-normal');
    await tester.enterText(
      find.byKey(const ValueKey('destination')),
      'Station Square',
    );
    await tester.tap(find.byKey(const ValueKey('route-1')));
    await tester.tap(find.byKey(const ValueKey('review-route')));
    await tester.pumpAndSettle();
    expect(find.textContaining('Route 2 reviewed locally'), findsOneWidget);
    await tester.tap(find.byType(SwitchListTile));
    await tester.pumpAndSettle();
    expect(
      find.textContaining('Offline. Sample route retained'),
      findsOneWidget,
    );
    await capture('transit-offline');
    await tester.tap(find.byKey(const ValueKey('mode-Audio')));
    await tester.pumpAndSettle();
    await capture('audio-normal');
    await tester.tap(find.byKey(const ValueKey('mute-0')));
    await tester.pumpAndSettle();
    expect(find.byTooltip('Unmute River / close'), findsOneWidget);
    await tester.drag(
      find.byKey(const ValueKey('playhead')),
      const Offset(90, 0),
    );
    await tester.tap(find.byKey(const ValueKey('export-audio')));
    await tester.pumpAndSettle();
    expect(find.textContaining('Export unavailable'), findsOneWidget);
    await capture('audio-export-failure');
    await tester.tap(find.byKey(const ValueKey('mode-Beacon')));
    await tester.pumpAndSettle();
    await capture('beacon-normal');
    await tester.tap(find.byKey(const ValueKey('beacon-0')));
    await tester.pumpAndSettle();
    expect(find.textContaining('Wrong frequency'), findsOneWidget);
    await capture('beacon-wrong-input');
    await tester.tap(find.byKey(const ValueKey('pause-game')));
    await tester.pumpAndSettle();
    expect(
      tester
          .widget<OutlinedButton>(find.byKey(const ValueKey('beacon-1')))
          .onPressed,
      isNull,
    );
    await tester.tap(find.byKey(const ValueKey('pause-game')));
    await tester.pumpAndSettle();
    for (final key in [
      LogicalKeyboardKey.digit2,
      LogicalKeyboardKey.digit5,
      LogicalKeyboardKey.digit8,
    ]) {
      await tester.sendKeyEvent(key, character: key.keyLabel);
      await tester.pumpAndSettle();
    }
    expect(find.textContaining('Relay complete.'), findsOneWidget);
    await capture('beacon-complete');
    semantics.dispose();
    await tester.runAsync(() async {
      await File('$output/report.json').writeAsString(
        const JsonEncoder.withIndent('  ').convert({
          'runtime': Platform.operatingSystem,
          'runtimeVersion': Platform.operatingSystemVersion,
          'method': 'Flutter integration_test running a compiled native desktop application',
          'status': 'passed',
          'captures': captures,
          'checks': [
            'Route selection and review',
            'Offline state preserves sample route',
            'Mute and playhead interaction',
            'Honest export failure',
            'Wrong puzzle input recovery',
            'Pause disables actions',
            'Injected keyboard input completes the relay',
            'Flutter exceptions absent at captured states',
          ],
          'limits': [
            'No Android/iOS device or emulator evidence',
            'Transit phone composition is hosted on Windows, not verified mobile OS behavior',
            'No physical controller, network service, audio playback or 3D engine test',
            'Harness injects input; this is not a human usability study',
            'Captures exclude OS chrome and do not certify assistive technology',
          ],
        }),
      );
    });
  });
}
