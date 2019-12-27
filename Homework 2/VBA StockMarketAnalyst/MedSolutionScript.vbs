Sub TickerAnalyzer()
    'for loop each sheet
    For Each ws In Worksheets
    
        'Varible Initialization
        Dim rowI As Long
        rowI = 2
        
        Dim currrentStock As String
        currentStock = ws.Cells(2, 1).Value
        
        'Using Long and LongLong because was getting overflow with smaller data types
        Dim BeginRow As Long
        Dim EndRow As Long
        Dim currentVolume As LongLong
        currentVolume = 0
        BeginRow = 2
        Dim StockCount As Long
        StockCount = 1
        
        'Set Headers For Output
        ws.Cells(1, 9).Value = "Ticker"
        ws.Cells(1, 10).Value = "Yearly Change"
        ws.Cells(1, 11).Value = "PercentChange"
        ws.Cells(1, 12).Value = "Total Stock Volume"
        
        Do While ws.Cells(rowI, 1).Value <> 0
            If ws.Cells(rowI, 1).Value = currentStock Then
                   currentVolume = currentVolume + ws.Cells(rowI, 7).Value
            Else
                'change in stock so output results
                EndRow = rowI - 1
                ws.Cells(StockCount + 1, 9).Value = currentStock
                ws.Cells(StockCount + 1, 10).Value = ws.Cells(EndRow, 6).Value - ws.Cells(BeginRow, 3).Value
                
                'ColorFormatting *will not format 0
                If ws.Cells(StockCount + 1, 10).Value > 0 Then
                    ws.Cells(StockCount + 1, 10).Interior.ColorIndex = 4
                Else
                    ws.Cells(StockCount + 1, 10).Interior.ColorIndex = 3
                End If
                
                'If Diving By Zero Set Exception
                If ws.Cells(BeginRow, 3) = 0 Then
                    ws.Cells(StockCount + 1, 11).Value = 0
                    'MsgBox("Stock with Price of Zero")
                Else
                    ws.Cells(StockCount + 1, 11).Value = ws.Cells(StockCount + 1, 10).Value / ws.Cells(BeginRow, 3).Value * 100 & "%"
                
                End If
                ws.Cells(StockCount + 1, 12).Value = currentVolume
                StockCount = StockCount + 1
                
                'reset variables
                currentStock = ws.Cells(rowI, 1).Value
                currentVolume = ws.Cells(rowI, 7).Value
                BeginRow = rowI
            End If
        rowI = rowI + 1
        Loop
    
    Next ws
End Sub
